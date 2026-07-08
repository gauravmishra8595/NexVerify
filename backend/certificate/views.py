from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analysis.models import CandidateAnalysis
from assessment.models import AssessmentResult

from .models import Certificate
from .serializers import CertificateSerializer
from .services import (
    build_verification_url,
    compute_overall_score,
    derive_skill_level,
    generate_certificate_id,
    generate_certificate_pdf,
)

# Both DSA and Aptitude are generated with 25 questions each (see
# assessment/views.py) - the certificate's percentage score is computed
# against this combined maximum.
ASSESSMENT_MAX_SCORE = 100  # 2 marks × 25 questions × 2 quizzes = 100


class GenerateCertificateView(APIView):
    """
    POST /api/certificate/generate/

    Per the product requirements, a certificate requires the candidate to
    have completed identity verification, the DSA assessment, the
    aptitude assessment, AND resume analysis - all four. Returns a
    specific 400 naming whichever step is missing so the frontend can
    guide the candidate back to the right page.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not user.is_email_verified:
            return Response(
                {"error": "Verify your email before generating a certificate.", "missing_step": "verification"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = (
            AssessmentResult.objects.filter(user=user)
            .order_by("-created_at")
            .first()
        )

        if not result or result.dsa_score == 0 or result.aptitude_score == 0:
            return Response(
                {"error": "Complete both the DSA and aptitude assessments before generating a certificate.", "missing_step": "assessment"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        analysis = (
            CandidateAnalysis.objects.filter(user=user)
            .order_by("-created_at")
            .first()
        )

        if not analysis:
            return Response(
                {"error": "Run your resume analysis before generating a certificate.", "missing_step": "resume_analysis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assessment_total = result.dsa_score + result.aptitude_score
        overall_score = compute_overall_score(
            assessment_total=assessment_total,
            assessment_max=ASSESSMENT_MAX_SCORE,
            resume_overall_score=analysis.overall_score,
        )
        skill_level = derive_skill_level(overall_score)

        certificate_id = generate_certificate_id()
        candidate_name = user.username or user.email

        certificate = Certificate.objects.create(
            user=user,
            certificate_id=certificate_id,
            candidate_name=candidate_name,
            dsa_score=result.dsa_score,
            aptitude_score=result.aptitude_score,
            assessment_total=assessment_total,
            resume_overall_score=analysis.overall_score,
            overall_score=overall_score,
            skill_level=skill_level,
        )

        verification_url = build_verification_url(certificate_id)

        pdf_content = generate_certificate_pdf(
            certificate_id=certificate_id,
            candidate_name=candidate_name,
            overall_score=overall_score,
            skill_level=skill_level,
            dsa_score=result.dsa_score,
            aptitude_score=result.aptitude_score,
            generated_at=timezone.now(),
            verification_url=verification_url,
        )

        certificate.pdf_file.save(pdf_content.name, pdf_content, save=True)

        return Response(
            CertificateSerializer(certificate, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class MyLatestCertificateView(APIView):
    """GET /api/certificate/me/ - the candidate's most recently generated certificate, if any."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        certificate = (
            Certificate.objects.filter(user=request.user)
            .order_by("-generated_at")
            .first()
        )

        if not certificate:
            return Response({"error": "No certificate generated yet."}, status=status.HTTP_404_NOT_FOUND)

        return Response(CertificateSerializer(certificate, context={"request": request}).data)


class VerifyCertificateView(APIView):
    """
    GET /api/certificate/verify/<certificate_id>/

    Public endpoint (no auth) - this is what the QR code on the
    certificate PDF links to, letting a recruiter confirm a certificate
    ID is real without needing an account.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, certificate_id):
        try:
            certificate = Certificate.objects.get(certificate_id=certificate_id)
        except Certificate.DoesNotExist:
            return Response({"valid": False, "error": "No certificate found with this ID."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "valid": True,
            "certificate_id": certificate.certificate_id,
            "candidate_name": certificate.candidate_name,
            "overall_score": certificate.overall_score,
            "skill_level": certificate.skill_level,
            "dsa_score": certificate.dsa_score,
            "aptitude_score": certificate.aptitude_score,
            "generated_at": certificate.generated_at,
        })

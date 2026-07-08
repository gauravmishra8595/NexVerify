from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from resume.models import ExtractionStatus, Resume

from .models import CandidateAnalysis
from .serializers import CandidateAnalysisSerializer
from .services import analyze_resume


class RunResumeAnalysisView(APIView):
    """
    POST /api/analysis/run/
    Runs AI analysis on the candidate's most recent successfully-parsed
    resume and stores the result. Re-running creates a fresh analysis
    row each time (history is preserved, same pattern as AssessmentResult).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume = (
            Resume.objects.filter(user=request.user, extraction_status=ExtractionStatus.DONE)
            .order_by("-uploaded_at")
            .first()
        )

        if not resume:
            return Response(
                {"error": "Upload and successfully parse a resume before running analysis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = analyze_resume(resume.raw_text, resume.parsed_data or {})

        analysis = CandidateAnalysis.objects.create(
            user=request.user,
            resume=resume,
            **result,
        )

        return Response(
            CandidateAnalysisSerializer(analysis).data,
            status=status.HTTP_201_CREATED,
        )


class MyLatestAnalysisView(APIView):
    """GET /api/analysis/me/ - the candidate's most recent analysis, if any."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        analysis = (
            CandidateAnalysis.objects.filter(user=request.user)
            .order_by("-created_at")
            .first()
        )

        if not analysis:
            return Response({"error": "No analysis run yet."}, status=status.HTTP_404_NOT_FOUND)

        return Response(CandidateAnalysisSerializer(analysis).data)

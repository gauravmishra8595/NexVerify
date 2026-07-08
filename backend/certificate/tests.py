from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from analysis.models import CandidateAnalysis
from assessment.models import AssessmentResult
from resume.models import Resume

from .models import Certificate
from .services import compute_overall_score, derive_skill_level, generate_certificate_id

User = get_user_model()


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


class CertificateServiceTests(TestCase):
    def test_generate_certificate_id_format(self):
        cert_id = generate_certificate_id()
        self.assertTrue(cert_id.startswith("CERT-VXY-"))
        parts = cert_id.split("-")
        self.assertEqual(len(parts), 4)

    def test_generate_certificate_id_is_unique(self):
        ids = {generate_certificate_id() for _ in range(50)}
        self.assertEqual(len(ids), 50)

    def test_derive_skill_level_thresholds(self):
        self.assertEqual(derive_skill_level(10), "BEGINNER")
        self.assertEqual(derive_skill_level(45), "INTERMEDIATE")
        self.assertEqual(derive_skill_level(70), "ADVANCED")
        self.assertEqual(derive_skill_level(90), "EXPERT")

    def test_compute_overall_score_with_resume(self):
        score = compute_overall_score(assessment_total=40, assessment_max=50, resume_overall_score=80)
        # assessment_pct = 80, resume = 80 -> average 80
        self.assertEqual(score, 80)

    def test_compute_overall_score_without_resume(self):
        score = compute_overall_score(assessment_total=25, assessment_max=50, resume_overall_score=None)
        self.assertEqual(score, 50)


class GenerateCertificateViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!",
            is_email_verified=True,
        )
        self.client = auth_client(self.user)

    def test_requires_authentication(self):
        anon = APIClient()
        response = anon.post("/api/certificate/generate/")
        self.assertEqual(response.status_code, 401)

    def test_blocks_if_not_verified(self):
        unverified = User.objects.create_user(
            username="unverified", email="unverified@gmail.com", password="StrongPass1!"
        )
        client = auth_client(unverified)
        response = client.post("/api/certificate/generate/")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["missing_step"], "verification")

    def test_blocks_if_assessments_not_complete(self):
        response = self.client.post("/api/certificate/generate/")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["missing_step"], "assessment")

    def test_blocks_if_no_resume_analysis(self):
        AssessmentResult.objects.create(user=self.user, dsa_score=20, aptitude_score=18, total_score=38)
        response = self.client.post("/api/certificate/generate/")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["missing_step"], "resume_analysis")

    def test_generates_certificate_when_all_steps_complete(self):
        AssessmentResult.objects.create(user=self.user, dsa_score=20, aptitude_score=18, total_score=38)

        from django.core.files.uploadedfile import SimpleUploadedFile
        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        resume = Resume.objects.create(user=self.user, file=f, original_filename="resume.pdf")

        CandidateAnalysis.objects.create(
            user=self.user, resume=resume, overall_score=75,
            ats_score=70, grammar_score=70, skill_match_score=70,
            project_quality_score=70, experience_score=70, project_score=70,
        )

        response = self.client.post("/api/certificate/generate/")

        self.assertEqual(response.status_code, 201)
        self.assertIn("certificate_id", response.data)
        self.assertEqual(response.data["dsa_score"], 20)
        self.assertEqual(response.data["aptitude_score"], 18)
        self.assertIsNotNone(response.data["pdf_url"])

        self.assertEqual(Certificate.objects.filter(user=self.user).count(), 1)


class VerifyCertificateViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!"
        )
        self.certificate = Certificate.objects.create(
            user=self.user,
            certificate_id="CERT-VXY-2026-TESTABCD",
            candidate_name="Test Candidate",
            dsa_score=20, aptitude_score=18, assessment_total=38,
            overall_score=75, skill_level="ADVANCED",
        )

    def test_verify_does_not_require_authentication(self):
        anon = APIClient()
        response = anon.get(f"/api/certificate/verify/{self.certificate.certificate_id}/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["valid"])
        self.assertEqual(response.data["candidate_name"], "Test Candidate")

    def test_verify_unknown_id_returns_404(self):
        anon = APIClient()
        response = anon.get("/api/certificate/verify/CERT-DOES-NOT-EXIST/")
        self.assertEqual(response.status_code, 404)
        self.assertFalse(response.data["valid"])

from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from resume.models import ExtractionStatus, Resume

from .models import CandidateAnalysis

User = get_user_model()

SAMPLE_ANALYSIS_RESULT = {
    "ats_score": 80,
    "grammar_score": 75,
    "skill_match_score": 90,
    "project_quality_score": 70,
    "experience_score": 65,
    "project_score": 60,
    "overall_score": 73,
    "recommendation": "Strong candidate overall.",
    "strengths": ["Good Python skills"],
    "improvements": ["Add more project detail"],
    "missing_skills": ["Docker"],
    "keyword_analysis": {"matched": ["Python", "Django"], "missing": ["Kubernetes"]},
}


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


def make_resume(user, status=ExtractionStatus.DONE):
    f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
    return Resume.objects.create(
        user=user,
        file=f,
        original_filename="resume.pdf",
        extraction_status=status,
        raw_text="John Doe Software Engineer Python Django",
        parsed_data={"skills": ["Python", "Django"], "experience": [], "projects": []},
    )


class RunAnalysisViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!"
        )
        self.client = auth_client(self.user)

    def test_requires_authentication(self):
        anon = APIClient()
        response = anon.post("/api/analysis/run/")
        self.assertEqual(response.status_code, 401)

    def test_no_resume_returns_400(self):
        response = self.client.post("/api/analysis/run/")
        self.assertEqual(response.status_code, 400)

    def test_resume_not_done_returns_400(self):
        make_resume(self.user, status=ExtractionStatus.PROCESSING)
        response = self.client.post("/api/analysis/run/")
        self.assertEqual(response.status_code, 400)

    @patch("analysis.views.analyze_resume")
    def test_successful_analysis(self, mock_analyze):
        mock_analyze.return_value = SAMPLE_ANALYSIS_RESULT
        make_resume(self.user)

        response = self.client.post("/api/analysis/run/")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["overall_score"], 73)
        self.assertEqual(response.data["keyword_analysis"]["matched"], ["Python", "Django"])

        self.assertEqual(CandidateAnalysis.objects.filter(user=self.user).count(), 1)

    @patch("analysis.views.analyze_resume")
    def test_uses_most_recent_done_resume(self, mock_analyze):
        mock_analyze.return_value = SAMPLE_ANALYSIS_RESULT
        make_resume(self.user)  # older, DONE
        latest = make_resume(self.user)  # newer, DONE

        response = self.client.post("/api/analysis/run/")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["resume"], latest.id)


class MyLatestAnalysisViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!"
        )
        self.client = auth_client(self.user)

    def test_no_analysis_yet_returns_404(self):
        response = self.client.get("/api/analysis/me/")
        self.assertEqual(response.status_code, 404)

    def test_returns_latest_analysis(self):
        resume = make_resume(self.user)
        CandidateAnalysis.objects.create(user=self.user, resume=resume, **SAMPLE_ANALYSIS_RESULT)

        response = self.client.get("/api/analysis/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["overall_score"], 73)

    def test_only_returns_own_analysis(self):
        other = User.objects.create_user(
            username="other", email="other@gmail.com", password="StrongPass1!"
        )
        resume = make_resume(other)
        CandidateAnalysis.objects.create(user=other, resume=resume, **SAMPLE_ANALYSIS_RESULT)

        response = self.client.get("/api/analysis/me/")
        self.assertEqual(response.status_code, 404)


class AnalysisServiceTests(TestCase):
    def test_clamp_score_handles_out_of_range(self):
        from .services import _clamp_score
        self.assertEqual(_clamp_score(150), 100)
        self.assertEqual(_clamp_score(-10), 0)
        self.assertEqual(_clamp_score("not a number"), 0)
        self.assertEqual(_clamp_score(75), 75)

    def test_heuristic_analysis_returns_valid_shape(self):
        from .services import _heuristic_analysis
        result = _heuristic_analysis(
            "Some resume text " * 50,
            {"skills": ["Python", "Django"], "experience": [], "projects": [], "education": []},
        )
        self.assertIn("overall_score", result)
        self.assertTrue(0 <= result["overall_score"] <= 100)
        self.assertIsInstance(result["strengths"], list)

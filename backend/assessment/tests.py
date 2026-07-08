from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AssessmentResult, AssessmentSession, AssessmentType

User = get_user_model()

SAMPLE_QUESTIONS = [
    {"id": 1, "question": "1+1?", "options": ["1", "2", "3", "4"], "answer": "2", "difficulty": "Easy"},
    {"id": 2, "question": "2+2?", "options": ["3", "4", "5", "6"], "answer": "4", "difficulty": "Easy"},
]


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


class AssessmentAccessControlTests(TestCase):
    def setUp(self):
        self.unverified = User.objects.create_user(
            username="unverified", email="unverified@gmail.com", password="StrongPass1!"
        )
        self.verified = User.objects.create_user(
            username="verified", email="verified@gmail.com", password="StrongPass1!",
            is_email_verified=True,
        )

    @patch("assessment.views.generate_dsa_questions")
    def test_unverified_user_cannot_generate_questions(self, mock_gen):
        client = auth_client(self.unverified)
        response = client.get("/api/assessment/generate/dsa/")
        self.assertEqual(response.status_code, 403)
        mock_gen.assert_not_called()

    @patch("assessment.views.generate_dsa_questions")
    def test_verified_user_can_generate_questions(self, mock_gen):
        mock_gen.return_value = SAMPLE_QUESTIONS
        client = auth_client(self.verified)
        response = client.get("/api/assessment/generate/dsa/")
        self.assertEqual(response.status_code, 201)

    def test_anonymous_cannot_generate_questions(self):
        client = APIClient()
        response = client.get("/api/assessment/generate/dsa/")
        self.assertEqual(response.status_code, 401)


class QuestionSanitizationTests(TestCase):
    """The 'answer' field must never reach the client."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!",
            is_email_verified=True,
        )
        self.client = auth_client(self.user)

    @patch("assessment.views.generate_dsa_questions")
    def test_answer_field_not_in_response(self, mock_gen):
        mock_gen.return_value = SAMPLE_QUESTIONS
        response = self.client.get("/api/assessment/generate/dsa/")

        for question in response.data["questions"]:
            self.assertNotIn("answer", question)
            self.assertIn("options", question)


class GradingSecurityTests(TestCase):
    """The server must grade against its own stored answers, never trust the client's claimed score."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!",
            is_email_verified=True,
        )
        self.client = auth_client(self.user)
        self.session = AssessmentSession.objects.create(
            user=self.user,
            assessment_type=AssessmentType.DSA,
            questions=SAMPLE_QUESTIONS,
            time_limit_seconds=600,
        )

    def test_correct_answers_score_full_marks(self):
        response = self.client.post("/api/assessment/submit/", {
            "session_id": self.session.id,
            "answers": [
                {"question_id": 1, "selected_option": "2"},
                {"question_id": 2, "selected_option": "4"},
            ],
        }, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["score"], 2)

    def test_wrong_answers_score_zero_even_if_client_claims_otherwise(self):
        # Client cannot send its own "score" - the payload has no such field,
        # and even if extra keys are sent, they're ignored by the serializer.
        response = self.client.post("/api/assessment/submit/", {
            "session_id": self.session.id,
            "score": 999,  # attempted injection - must be ignored
            "answers": [
                {"question_id": 1, "selected_option": "3"},
                {"question_id": 2, "selected_option": "3"},
            ],
        }, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["score"], 0)

    def test_cannot_submit_same_session_twice(self):
        self.client.post("/api/assessment/submit/", {
            "session_id": self.session.id,
            "answers": [{"question_id": 1, "selected_option": "2"}],
        }, format="json")

        response = self.client.post("/api/assessment/submit/", {
            "session_id": self.session.id,
            "answers": [{"question_id": 1, "selected_option": "2"}],
        }, format="json")

        self.assertEqual(response.status_code, 400)

    def test_cannot_submit_someone_elses_session(self):
        other_user = User.objects.create_user(
            username="other", email="other@gmail.com", password="StrongPass1!",
            is_email_verified=True,
        )
        other_client = auth_client(other_user)

        response = other_client.post("/api/assessment/submit/", {
            "session_id": self.session.id,
            "answers": [{"question_id": 1, "selected_option": "2"}],
        }, format="json")

        self.assertEqual(response.status_code, 404)

    def test_combined_result_after_both_assessments(self):
        self.client.post("/api/assessment/submit/", {
            "session_id": self.session.id,
            "answers": [
                {"question_id": 1, "selected_option": "2"},
                {"question_id": 2, "selected_option": "4"},
            ],
        }, format="json")

        aptitude_session = AssessmentSession.objects.create(
            user=self.user,
            assessment_type=AssessmentType.APTITUDE,
            questions=SAMPLE_QUESTIONS,
            time_limit_seconds=300,
        )

        response = self.client.post("/api/assessment/submit/", {
            "session_id": aptitude_session.id,
            "answers": [
                {"question_id": 1, "selected_option": "2"},
                {"question_id": 2, "selected_option": "3"},
            ],
        }, format="json")

        self.assertEqual(response.status_code, 200)
        result_data = response.data["result"]
        self.assertEqual(result_data["dsa_score"], 2)
        self.assertEqual(result_data["aptitude_score"], 1)
        self.assertEqual(result_data["total_score"], 3)

        self.assertEqual(AssessmentResult.objects.filter(user=self.user).count(), 1)


class MyLatestResultTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!",
        )
        self.client = auth_client(self.user)

    def test_no_results_yet_returns_404(self):
        response = self.client.get("/api/assessment/results/me/")
        self.assertEqual(response.status_code, 404)

    def test_returns_latest_result(self):
        AssessmentResult.objects.create(user=self.user, dsa_score=5, aptitude_score=6, total_score=11)
        response = self.client.get("/api/assessment/results/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_score"], 11)

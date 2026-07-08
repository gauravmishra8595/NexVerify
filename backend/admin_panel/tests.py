from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from assessment.models import AssessmentResult

User = get_user_model()


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


class AdminAccessControlTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin1", email="admin@gmail.com", password="StrongPass1!", role="ADMIN"
        )
        self.candidate = User.objects.create_user(
            username="cand1", email="cand@gmail.com", password="StrongPass1!", role="USER"
        )

    def test_regular_user_cannot_access_candidate_list(self):
        client = auth_client(self.candidate)
        response = client.get("/api/admin-panel/candidates/")
        self.assertEqual(response.status_code, 403)

    def test_admin_can_access_candidate_list(self):
        client = auth_client(self.admin)
        response = client.get("/api/admin-panel/candidates/")
        self.assertEqual(response.status_code, 200)

    def test_anonymous_cannot_access_candidate_list(self):
        client = APIClient()
        response = client.get("/api/admin-panel/candidates/")
        self.assertEqual(response.status_code, 401)

    def test_admin_login_rejects_non_admin(self):
        client = APIClient()
        response = client.post(
            "/api/admin-panel/login/",
            {"email": "cand@gmail.com", "password": "StrongPass1!"},
        )
        self.assertEqual(response.status_code, 403)

    def test_admin_login_succeeds_for_admin(self):
        client = APIClient()
        response = client.post(
            "/api/admin-panel/login/",
            {"email": "admin@gmail.com", "password": "StrongPass1!"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)


class CandidateManagementTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin1", email="admin@gmail.com", password="StrongPass1!", role="ADMIN"
        )
        self.candidate = User.objects.create_user(
            username="cand1",
            email="cand@gmail.com",
            password="StrongPass1!",
            role="USER",
            is_email_verified=True,
        )
        AssessmentResult.objects.create(user=self.candidate, dsa_score=80, aptitude_score=70, total_score=75)
        self.client = auth_client(self.admin)

    def test_candidate_list_includes_latest_score(self):
        response = self.client.get("/api/admin-panel/candidates/")
        self.assertEqual(response.status_code, 200)
        results = response.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["latest_total_score"], 75)

    def test_search_filters_candidates(self):
        response = self.client.get("/api/admin-panel/candidates/?search=nomatch")
        self.assertEqual(response.data["count"], 0)

        response = self.client.get("/api/admin-panel/candidates/?search=cand1")
        self.assertEqual(response.data["count"], 1)

    def test_verified_filter(self):
        response = self.client.get("/api/admin-panel/candidates/?verified=none")
        self.assertEqual(response.data["count"], 0)

        response = self.client.get("/api/admin-panel/candidates/?verified=email")
        self.assertEqual(response.data["count"], 1)

    def test_suspend_toggles_is_active(self):
        response = self.client.post(f"/api/admin-panel/candidates/{self.candidate.id}/suspend/")
        self.assertEqual(response.status_code, 200)
        self.candidate.refresh_from_db()
        self.assertFalse(self.candidate.is_active)

        response = self.client.post(f"/api/admin-panel/candidates/{self.candidate.id}/suspend/")
        self.candidate.refresh_from_db()
        self.assertTrue(self.candidate.is_active)

    def test_admin_cannot_suspend_another_admin_via_candidate_endpoint(self):
        other_admin = User.objects.create_user(
            username="admin2", email="admin2@gmail.com", password="StrongPass1!", role="ADMIN"
        )
        response = self.client.post(f"/api/admin-panel/candidates/{other_admin.id}/suspend/")
        self.assertEqual(response.status_code, 404)

    def test_delete_candidate(self):
        response = self.client.delete(f"/api/admin-panel/candidates/{self.candidate.id}/delete/")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(id=self.candidate.id).exists())

    def test_csv_export_returns_csv(self):
        response = self.client.get("/api/admin-panel/candidates/export/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "text/csv")
        self.assertIn(b"cand1", response.content)


class AnalyticsSummaryTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin1", email="admin@gmail.com", password="StrongPass1!", role="ADMIN"
        )
        User.objects.create_user(
            username="cand1", email="c1@gmail.com", password="StrongPass1!", role="USER",
            is_email_verified=True,
        )
        User.objects.create_user(
            username="cand2", email="c2@gmail.com", password="StrongPass1!", role="USER",
            is_active=False,
        )
        self.client = auth_client(self.admin)

    def test_summary_counts(self):
        response = self.client.get("/api/admin-panel/analytics/summary/")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["total_candidates"], 2)
        self.assertEqual(data["verified_email_count"], 1)
        self.assertEqual(data["suspended_count"], 1)

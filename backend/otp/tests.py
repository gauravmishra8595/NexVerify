from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPVerification
from .services import create_otp, seconds_until_resend_allowed, verify_otp, OTPVerificationError

User = get_user_model()


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


class OTPServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@gmail.com",
            password="StrongPass1!",
        )

    def test_create_otp_sets_expiry(self):
        record = create_otp(user=self.user, email="test@gmail.com")
        self.assertIsNotNone(record.expires_at)
        self.assertFalse(record.is_verified)
        self.assertEqual(len(record.otp_code), 6)

    def test_verify_otp_success(self):
        record = create_otp(user=self.user, email="test@gmail.com")
        verified = verify_otp(email="test@gmail.com", otp_code=record.otp_code)
        self.assertTrue(verified.is_verified)

    def test_verify_otp_wrong_code_raises(self):
        create_otp(user=self.user, email="test@gmail.com")
        with self.assertRaises(OTPVerificationError) as ctx:
            verify_otp(email="test@gmail.com", otp_code="000000")
        self.assertEqual(ctx.exception.code, "invalid_otp")

    def test_verify_otp_expired_raises(self):
        record = create_otp(user=self.user, email="test@gmail.com")
        record.expires_at = timezone.now() - timedelta(minutes=1)
        record.save(update_fields=["expires_at"])
        with self.assertRaises(OTPVerificationError) as ctx:
            verify_otp(email="test@gmail.com", otp_code=record.otp_code)
        self.assertEqual(ctx.exception.code, "expired")

    def test_verify_otp_not_found_raises(self):
        with self.assertRaises(OTPVerificationError) as ctx:
            verify_otp(email="nobody@gmail.com", otp_code="123456")
        self.assertEqual(ctx.exception.code, "not_found")

    def test_too_many_attempts_locks_out(self):
        record = create_otp(user=self.user, email="test@gmail.com")
        record.attempts = record.max_attempts
        record.save(update_fields=["attempts"])
        with self.assertRaises(OTPVerificationError) as ctx:
            verify_otp(email="test@gmail.com", otp_code=record.otp_code)
        self.assertEqual(ctx.exception.code, "too_many_attempts")

    def test_resend_cooldown(self):
        create_otp(user=self.user, email="test@gmail.com")
        wait = seconds_until_resend_allowed("test@gmail.com")
        self.assertGreater(wait, 0)


class EmailOTPViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@gmail.com",
            password="StrongPass1!",
        )
        self.client = auth_client(self.user)

    def test_requires_authentication(self):
        anon_client = APIClient()
        response = anon_client.post("/api/verify/email/send/", {"email": "test@gmail.com"})
        self.assertEqual(response.status_code, 401)

    @patch("otp.views.send_otp_email")
    def test_send_email_otp_success(self, mock_send):
        response = self.client.post("/api/verify/email/send/", {"email": "test@gmail.com"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        mock_send.assert_called_once()

    def test_send_email_otp_missing_email(self):
        response = self.client.post("/api/verify/email/send/", {})
        self.assertEqual(response.status_code, 400)

    @patch("otp.views.send_otp_email")
    def test_verify_email_otp_success_marks_user_verified(self, mock_send):
        record = create_otp(user=self.user, email="test@gmail.com")
        response = self.client.post(
            "/api/verify/email/check/",
            {"email": "test@gmail.com", "otp": record.otp_code},
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_email_verified)

    def test_verify_email_otp_invalid_code(self):
        create_otp(user=self.user, email="test@gmail.com")
        response = self.client.post(
            "/api/verify/email/check/",
            {"email": "test@gmail.com", "otp": "000000"},
        )
        self.assertEqual(response.status_code, 400)

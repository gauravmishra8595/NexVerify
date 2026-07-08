import random
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from .models import OTPVerification

RESEND_COOLDOWN_SECONDS = getattr(settings, "OTP_RESEND_COOLDOWN_SECONDS", 30)
PURPOSE_EMAIL = "EMAIL_VERIFICATION"


def generate_otp_code() -> str:
    return str(random.randint(100000, 999999))


def seconds_until_resend_allowed(email: str) -> int:
    last = (
        OTPVerification.objects.filter(email=email, purpose=PURPOSE_EMAIL)
        .order_by("-created_at")
        .first()
    )
    if not last:
        return 0
    elapsed = (timezone.now() - last.created_at).total_seconds()
    return max(0, int(RESEND_COOLDOWN_SECONDS - elapsed))


def create_otp(*, user=None, email: str) -> OTPVerification:
    code = generate_otp_code()
    ttl_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 10)
    return OTPVerification.objects.create(
        user=user,
        purpose=PURPOSE_EMAIL,
        email=email,
        otp_code=code,
        expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
    )


class OTPVerificationError(Exception):
    def __init__(self, message: str, code: str = "invalid_otp"):
        self.message = message
        self.code = code
        super().__init__(message)


def verify_otp(*, email: str, otp_code: str) -> OTPVerification:
    record = (
        OTPVerification.objects.filter(email=email, purpose=PURPOSE_EMAIL)
        .order_by("-created_at")
        .first()
    )

    if not record:
        raise OTPVerificationError("No OTP was requested for this email.", "not_found")
    if record.is_verified:
        raise OTPVerificationError("This OTP has already been used.", "already_used")
    if record.is_expired:
        raise OTPVerificationError("OTP has expired. Please request a new one.", "expired")
    if not record.can_retry():
        raise OTPVerificationError("Too many incorrect attempts. Please request a new OTP.", "too_many_attempts")
    if record.otp_code != otp_code:
        record.attempts += 1
        record.save(update_fields=["attempts"])
        raise OTPVerificationError("Invalid OTP. Please try again.", "invalid_otp")

    record.is_verified = True
    record.verified_at = timezone.now()
    record.save(update_fields=["is_verified", "verified_at"])
    return record

from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class OTPPurpose(models.TextChoices):
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION", "Email Verification"


class OTPVerification(models.Model):
    """
    Email-only OTP verification record.
    WhatsApp OTP was removed — it required a paid Twilio account.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="otp_records",
        null=True,
        blank=True,
    )

    purpose = models.CharField(
        max_length=32,
        choices=OTPPurpose.choices,
        default=OTPPurpose.EMAIL_VERIFICATION,
    )

    email = models.EmailField(null=True, blank=True)

    otp_code = models.CharField(max_length=6)

    is_verified = models.BooleanField(default=False)

    attempts = models.PositiveSmallIntegerField(default=0)
    max_attempts = models.PositiveSmallIntegerField(default=5)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["email", "purpose"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} [{self.purpose}] - {self.otp_code}"

    def save(self, *args, **kwargs):
        if not self.expires_at:
            ttl_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 10)
            self.expires_at = timezone.now() + timedelta(minutes=ttl_minutes)
        super().save(*args, **kwargs)

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at

    def can_retry(self) -> bool:
        return self.attempts < self.max_attempts

from django.conf import settings
from django.db import models


class NotificationChannel(models.TextChoices):
    EMAIL = "EMAIL", "Email"


class NotificationStatus(models.TextChoices):
    SENT = "SENT", "Sent"
    FAILED = "FAILED", "Failed"


class NotificationLog(models.Model):
    """
    Audit trail of every notification VerifyXY has attempted to send.
    Useful for debugging Twilio/SMTP delivery issues from the admin panel.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notification_logs",
    )

    channel = models.CharField(max_length=16, choices=NotificationChannel.choices)
    destination = models.CharField(max_length=255)
    subject = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=16, choices=NotificationStatus.choices)
    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.channel}] {self.destination} - {self.status}"

import logging

import resend
from django.conf import settings

logger = logging.getLogger(__name__)

resend.api_key = settings.RESEND_API_KEY


class EmailSendError(Exception):
    pass


def send_otp_email(*, to_email: str, otp_code: str, purpose_label: str = "Email Verification") -> None:
    """
    Sends OTP email using Resend API.
    """

    subject = "Your NexVerify Verification Code"

    html_body = f"""
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px">
        <h2>NexVerify</h2>

        <p>Your verification code for <strong>{purpose_label}</strong> is:</p>

        <div style="
            font-size:36px;
            font-weight:bold;
            letter-spacing:8px;
            background:#f3f4f6;
            padding:20px;
            text-align:center;
            border-radius:10px;">
            {otp_code}
        </div>

        <p>
            This code expires in
            {getattr(settings, "OTP_EXPIRY_MINUTES", 10)}
            minutes.
        </p>

        <p>If you didn't request this email, you can safely ignore it.</p>
    </div>
    """

    from .models import NotificationChannel, NotificationLog, NotificationStatus

    try:
        logger.info("Sending OTP via Resend to %s", to_email)

        resend.Emails.send(
            {
                "from": "NexVerify <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_body,
            }
        )

        NotificationLog.objects.create(
            channel=NotificationChannel.EMAIL,
            destination=to_email,
            subject=subject,
            status=NotificationStatus.SENT,
        )

        logger.info("OTP email sent successfully")

    except Exception as exc:
        logger.exception("Resend email failed")

        NotificationLog.objects.create(
            channel=NotificationChannel.EMAIL,
            destination=to_email,
            subject=subject,
            status=NotificationStatus.FAILED,
            error_message=str(exc),
        )

        raise EmailSendError(str(exc)) from exc
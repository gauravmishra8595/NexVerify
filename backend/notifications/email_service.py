import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


class EmailSendError(Exception):
    pass


def send_otp_email(
    *,
    to_email: str,
    otp_code: str,
    purpose_label: str = "Email Verification",
) -> None:

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
        logger.info("Sending OTP email to %s", to_email)

        email = EmailMultiAlternatives(
            subject=subject,
            body=f"Your OTP is {otp_code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )

        email.attach_alternative(html_body, "text/html")
        email.send(fail_silently=False)

        NotificationLog.objects.create(
            channel=NotificationChannel.EMAIL,
            destination=to_email,
            subject=subject,
            status=NotificationStatus.SENT,
        )

        logger.info("OTP email sent successfully")

    except Exception as exc:
        logger.exception("SMTP email failed")

        NotificationLog.objects.create(
            channel=NotificationChannel.EMAIL,
            destination=to_email,
            subject=subject,
            status=NotificationStatus.FAILED,
            error_message=str(exc),
        )

        raise EmailSendError(str(exc)) from exc
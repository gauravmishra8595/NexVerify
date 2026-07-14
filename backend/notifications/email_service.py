import logging
import traceback
import socket
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


class EmailSendError(Exception):
    pass


logger.info("Resolving SMTP host...")
logger.info("Resolved IP: %s", socket.gethostbyname(settings.EMAIL_HOST))
logger.info("EMAIL_HOST=%s", settings.EMAIL_HOST)
logger.info("EMAIL_PORT=%s", settings.EMAIL_PORT)
logger.info("EMAIL_HOST_USER=%s", settings.EMAIL_HOST_USER)
logger.info("DEFAULT_FROM_EMAIL=%s", settings.DEFAULT_FROM_EMAIL)


def send_otp_email(
    *,
    to_email: str,
    otp_code: str,
    purpose_label: str = "Email Verification",
) -> None:
    """
    Sends OTP email using Django SMTP backend.
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

    from .models import (
        NotificationChannel,
        NotificationLog,
        NotificationStatus,
    )

    try:
        logger.info("=" * 60)
        logger.info("Starting SMTP email send")
        logger.info("Recipient: %s", to_email)

        logger.info("EMAIL_HOST = %s", settings.EMAIL_HOST)
        logger.info("EMAIL_PORT = %s", settings.EMAIL_PORT)
        logger.info("EMAIL_HOST_USER = %s", settings.EMAIL_HOST_USER)
        logger.info("DEFAULT_FROM_EMAIL = %s", settings.DEFAULT_FROM_EMAIL)
        logger.info("EMAIL_USE_TLS = %s", settings.EMAIL_USE_TLS)

        email = EmailMultiAlternatives(
            subject=subject,
            body=f"Your OTP is {otp_code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )

        email.attach_alternative(html_body, "text/html")

        logger.info("Connecting to SMTP server...")

        sent = email.send(fail_silently=False)

        logger.info("SMTP send completed successfully.")
        logger.info("Email.send() returned: %s", sent)

        NotificationLog.objects.create(
            channel=NotificationChannel.EMAIL,
            destination=to_email,
            subject=subject,
            status=NotificationStatus.SENT,
        )

        logger.info("NotificationLog saved.")
        logger.info("=" * 60)

    except Exception as exc:
        logger.error("=" * 60)
        logger.error("SMTP EMAIL FAILED")
        logger.error("Exception Type: %s", type(exc).__name__)
        logger.error("Exception Message: %s", str(exc))
        logger.error(traceback.format_exc())
        logger.error("=" * 60)

        NotificationLog.objects.create(
            channel=NotificationChannel.EMAIL,
            destination=to_email,
            subject=subject,
            status=NotificationStatus.FAILED,
            error_message=str(exc),
        )

        raise EmailSendError(str(exc)) from exc

    # try:
    #     logger.info("Sending OTP email to %s", to_email)

    #     email = EmailMultiAlternatives(
    #         subject=subject,
    #         body=f"Your OTP is {otp_code}",
    #         from_email=settings.DEFAULT_FROM_EMAIL,
    #         to=[to_email],
    #     )

    #     email.attach_alternative(html_body, "text/html")
    #     email.send(fail_silently=False)

    #     NotificationLog.objects.create(
    #         channel=NotificationChannel.EMAIL,
    #         destination=to_email,
    #         subject=subject,
    #         status=NotificationStatus.SENT,
    #     )

    #     logger.info("OTP email sent successfully")

    # except Exception as exc:
    #     logger.exception("SMTP email failed")

    #     NotificationLog.objects.create(
    #         channel=NotificationChannel.EMAIL,
    #         destination=to_email,
    #         subject=subject,
    #         status=NotificationStatus.FAILED,
    #         error_message=str(exc),
    #     )

    #     raise EmailSendError(str(exc)) from exc

import logging
import smtplib
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


class EmailSendError(Exception):
    pass


def send_otp_email(*, to_email: str, otp_code: str, purpose_label: str = "Email Verification") -> None:
    """
    Sends a VerifyXY OTP email. Raises EmailSendError if delivery fails,
    so callers can decide how to surface that to the client.
    """
    subject = "Your VerifyXY Verification Code"

    text_body = (
        f"Your VerifyXY OTP for {purpose_label} is: {otp_code}\n\n"
        f"This code expires in {getattr(settings, 'OTP_EXPIRY_MINUTES', 10)} minutes. "
        "If you didn't request this, you can safely ignore this email."
    )

    html_body = f"""
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #111827;">VerifyXY</h2>
      <p style="color: #374151; font-size: 15px;">Your verification code for <strong>{purpose_label}</strong> is:</p>
      <div style="background: #F3F4F6; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827;">{otp_code}</span>
      </div>
      <p style="color: #6B7280; font-size: 13px;">
        This code expires in {getattr(settings, 'OTP_EXPIRY_MINUTES', 10)} minutes.
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    """

    # Local import to avoid a circular import at module load time
    # (notifications.models -> ... -> notifications.email_service).
    from .models import NotificationChannel, NotificationLog, NotificationStatus

    try:
     logger.info("Preparing OTP email for %s", to_email)

     message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )

     message.attach_alternative(html_body, "text/html")

     logger.info(
        "Connecting to SMTP server %s:%s",
        settings.EMAIL_HOST,
        settings.EMAIL_PORT,
    )

     message.send(fail_silently=False)

     logger.info("OTP email sent successfully to %s", to_email)

    except smtplib.SMTPException as exc:
     logger.exception("SMTP Error while sending email")
     raise EmailSendError(str(exc)) from exc

    except Exception as exc:
     logger.exception("Unexpected error while sending email")
     raise EmailSendError(str(exc)) from exc
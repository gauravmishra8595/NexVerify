from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.email_service import EmailSendError, send_otp_email

from .services import (
    OTPVerificationError,
    create_otp,
    seconds_until_resend_allowed,
    verify_otp,
)


class SendEmailOTPView(APIView):
    """POST /api/verify/email/send/  — Body: { "email": "user@example.com" }"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        if not email:
            return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        wait = seconds_until_resend_allowed(email)
        if wait > 0:
            return Response(
                {"message": f"Please wait {wait}s before requesting another OTP."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp_record = create_otp(user=request.user, email=email)

        try:
            send_otp_email(to_email=email, otp_code=otp_record.otp_code, purpose_label="Email Verification")
        except EmailSendError as e:
            otp_record.delete()
            return Response(
                {"message": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"message": "OTP sent to your email successfully."}, status=status.HTTP_200_OK)


class VerifyEmailOTPView(APIView):
    """POST /api/verify/email/check/  — Body: { "email": "...", "otp": "123456" }"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        otp = (request.data.get("otp") or "").strip()

        if not email or not otp:
            return Response({"message": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verify_otp(email=email, otp_code=otp)
        except OTPVerificationError as exc:
            return Response({"message": exc.message, "code": exc.code}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

from django.urls import path
from .views import (
    SendEmailOTPView,
    VerifyEmailOTPView,
    smtp_test,
)

urlpatterns = [
    path("email/send/", SendEmailOTPView.as_view(), name="send-email-otp"),
    path("email/check/", VerifyEmailOTPView.as_view(), name="verify-email-otp"),

    # Temporary test endpoint
    path("smtp-test/", smtp_test, name="smtp-test"),
]
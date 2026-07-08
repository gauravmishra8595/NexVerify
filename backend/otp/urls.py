from django.urls import path
from .views import SendEmailOTPView, VerifyEmailOTPView

urlpatterns = [
    path("email/send/", SendEmailOTPView.as_view(), name="send-email-otp"),
    path("email/check/", VerifyEmailOTPView.as_view(), name="verify-email-otp"),
]

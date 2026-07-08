from django.contrib import admin

from .models import OTPVerification


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "purpose",
        "email",
        "otp_code",
        "is_verified",
        "attempts",
        "created_at",
        "expires_at",
    )
    list_filter = ("purpose", "is_verified")
    search_fields = ("email", "otp_code")
    readonly_fields = ("created_at", "verified_at")
    ordering = ("-created_at",)

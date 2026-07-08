from django.contrib import admin

from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("certificate_id", "candidate_name", "overall_score", "skill_level", "generated_at")
    search_fields = ("certificate_id", "candidate_name", "user__email")
    list_filter = ("skill_level",)
    readonly_fields = ("certificate_id", "generated_at")
    ordering = ("-generated_at",)

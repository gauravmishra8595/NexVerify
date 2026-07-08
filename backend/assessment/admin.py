from django.contrib import admin

from .models import AssessmentResult, AssessmentSession


@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ("user", "dsa_score", "aptitude_score", "total_score", "created_at")
    search_fields = ("user__email", "user__username")
    ordering = ("-created_at",)


@admin.register(AssessmentSession)
class AssessmentSessionAdmin(admin.ModelAdmin):
    list_display = ("user", "assessment_type", "is_submitted", "score", "created_at")
    list_filter = ("assessment_type", "is_submitted")
    search_fields = ("user__email", "user__username")
    readonly_fields = ("questions", "created_at", "submitted_at")
    ordering = ("-created_at",)

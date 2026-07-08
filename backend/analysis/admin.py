from django.contrib import admin

from .models import CandidateAnalysis


@admin.register(CandidateAnalysis)
class CandidateAnalysisAdmin(admin.ModelAdmin):
    list_display = ("user", "overall_score", "ats_score", "skill_match_score", "created_at")
    search_fields = ("user__email", "user__username")
    readonly_fields = (
        "strengths", "improvements", "missing_skills", "keyword_analysis", "created_at",
    )
    ordering = ("-created_at",)

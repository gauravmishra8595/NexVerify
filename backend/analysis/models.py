from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class CandidateAnalysis(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    resume = models.ForeignKey(
        "resume.Resume",
        on_delete=models.CASCADE,
        related_name="analyses",
    )

    # Sub-scores, each 0-100
    ats_score = models.IntegerField(default=0)
    grammar_score = models.IntegerField(default=0)
    skill_match_score = models.IntegerField(default=0)
    project_quality_score = models.IntegerField(default=0)
    experience_score = models.IntegerField(default=0)
    project_score = models.IntegerField(default=0)

    overall_score = models.IntegerField(default=0)

    recommendation = models.TextField(blank=True)
    strengths = models.JSONField(default=list, blank=True)
    improvements = models.JSONField(default=list, blank=True)
    missing_skills = models.JSONField(default=list, blank=True)

    # Keyword analysis - {"matched": [...], "missing": [...]}
    keyword_analysis = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.overall_score}"

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class SkillLevel(models.TextChoices):
    BEGINNER = "BEGINNER", "Beginner"
    INTERMEDIATE = "INTERMEDIATE", "Intermediate"
    ADVANCED = "ADVANCED", "Advanced"
    EXPERT = "EXPERT", "Expert"


class Certificate(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    certificate_id = models.CharField(
        max_length=100,
        unique=True
    )

    candidate_name = models.CharField(max_length=255)

    dsa_score = models.IntegerField(default=0)
    aptitude_score = models.IntegerField(default=0)
    assessment_total = models.IntegerField(default=0)
    resume_overall_score = models.IntegerField(null=True, blank=True)

    # Combined score (0-100) used to derive skill_level.
    overall_score = models.IntegerField(default=0)
    skill_level = models.CharField(
        max_length=16,
        choices=SkillLevel.choices,
        default=SkillLevel.BEGINNER,
    )

    pdf_file = models.FileField(upload_to="certificates/", null=True, blank=True)

    generated_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-generated_at"]

    def __str__(self):
        return f"{self.certificate_id} - {self.candidate_name}"

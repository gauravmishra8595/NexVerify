from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ExtractionStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    PROCESSING = "PROCESSING", "Processing"
    DONE = "DONE", "Done"
    FAILED = "FAILED", "Failed"


class Resume(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    file = models.FileField(
        upload_to="resumes/"
    )

    original_filename = models.CharField(max_length=255, blank=True)

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    resume_score = models.IntegerField(
        default=0
    )

    # Raw text pulled out of the PDF/DOCX, kept so re-analysis doesn't
    # require re-parsing the original file.
    raw_text = models.TextField(blank=True)

    # Structured extraction - {"education": [...], "skills": [...],
    # "experience": [...], "projects": [...], "certifications": [...],
    # "cgpa": "...", "languages": [...], "frameworks": [...]}
    parsed_data = models.JSONField(null=True, blank=True)

    extraction_status = models.CharField(
        max_length=16,
        choices=ExtractionStatus.choices,
        default=ExtractionStatus.PENDING,
    )

    extraction_error = models.TextField(blank=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.user.email

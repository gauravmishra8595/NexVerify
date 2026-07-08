from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class AssessmentType(models.TextChoices):
    DSA = "DSA", "DSA"
    APTITUDE = "APTITUDE", "Aptitude"


class AssessmentSession(models.Model):
    """
    Holds the exact set of questions (with correct answers) served to a
    candidate for one attempt. Submitting an attempt grades the
    candidate's answers against THIS record server-side - the client
    never gets to report its own score.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    assessment_type = models.CharField(max_length=16, choices=AssessmentType.choices)

    # List of {"id": int, "question": str, "options": [str,...], "answer": str}
    # `answer` here is the correct option - never stripped before storing,
    # since this record is server-side only and never sent back to the client
    # except as a sanitized version (see serializers.py).
    questions = models.JSONField()

    time_limit_seconds = models.PositiveIntegerField()

    is_submitted = models.BooleanField(default=False)

    score = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.assessment_type} session #{self.id}"

    @property
    def is_expired(self) -> bool:
        deadline = self.created_at + timedelta(seconds=self.time_limit_seconds)
        # Give a small grace window for network latency on submit.
        grace_seconds = 15
        return timezone.now() > deadline + timedelta(seconds=grace_seconds)


class AssessmentResult(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    dsa_score = models.IntegerField(
        default=0
    )

    aptitude_score = models.IntegerField(
        default=0
    )

    total_score = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.user.email
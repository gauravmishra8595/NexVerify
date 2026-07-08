import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("resume", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="CandidateAnalysis",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("ats_score", models.IntegerField(default=0)),
                ("grammar_score", models.IntegerField(default=0)),
                ("skill_match_score", models.IntegerField(default=0)),
                ("project_quality_score", models.IntegerField(default=0)),
                ("experience_score", models.IntegerField(default=0)),
                ("project_score", models.IntegerField(default=0)),
                ("overall_score", models.IntegerField(default=0)),
                ("recommendation", models.TextField(blank=True)),
                ("strengths", models.JSONField(blank=True, default=list)),
                ("improvements", models.JSONField(blank=True, default=list)),
                ("missing_skills", models.JSONField(blank=True, default=list)),
                ("keyword_analysis", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "resume",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="analyses",
                        to="resume.resume",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]

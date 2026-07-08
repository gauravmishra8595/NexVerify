import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Certificate",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("certificate_id", models.CharField(max_length=100, unique=True)),
                ("candidate_name", models.CharField(max_length=255)),
                ("dsa_score", models.IntegerField(default=0)),
                ("aptitude_score", models.IntegerField(default=0)),
                ("assessment_total", models.IntegerField(default=0)),
                ("resume_overall_score", models.IntegerField(blank=True, null=True)),
                ("overall_score", models.IntegerField(default=0)),
                (
                    "skill_level",
                    models.CharField(
                        choices=[
                            ("BEGINNER", "Beginner"),
                            ("INTERMEDIATE", "Intermediate"),
                            ("ADVANCED", "Advanced"),
                            ("EXPERT", "Expert"),
                        ],
                        default="BEGINNER",
                        max_length=16,
                    ),
                ),
                ("pdf_file", models.FileField(blank=True, null=True, upload_to="certificates/")),
                ("generated_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-generated_at"],
            },
        ),
    ]

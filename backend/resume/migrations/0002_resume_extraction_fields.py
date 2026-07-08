from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("resume", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="resume",
            name="original_filename",
            field=models.CharField(blank=True, max_length=255, default=""),
        ),
        migrations.AddField(
            model_name="resume",
            name="raw_text",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="resume",
            name="parsed_data",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="resume",
            name="extraction_status",
            field=models.CharField(
                choices=[
                    ("PENDING", "Pending"),
                    ("PROCESSING", "Processing"),
                    ("DONE", "Done"),
                    ("FAILED", "Failed"),
                ],
                default="PENDING",
                max_length=16,
            ),
        ),
        migrations.AddField(
            model_name="resume",
            name="extraction_error",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AlterModelOptions(
            name="resume",
            options={"ordering": ["-uploaded_at"]},
        ),
    ]

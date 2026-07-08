from rest_framework import serializers

from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = [
            "id",
            "certificate_id",
            "candidate_name",
            "dsa_score",
            "aptitude_score",
            "assessment_total",
            "resume_overall_score",
            "overall_score",
            "skill_level",
            "pdf_url",
            "generated_at",
        ]

    def get_pdf_url(self, obj):
        request = self.context.get("request")
        if not obj.pdf_file:
            return None
        return request.build_absolute_uri(obj.pdf_file.url) if request else obj.pdf_file.url

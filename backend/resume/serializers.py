from rest_framework import serializers

from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            "id",
            "original_filename",
            "file_url",
            "uploaded_at",
            "extraction_status",
            "extraction_error",
            "parsed_data",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return None
        return request.build_absolute_uri(obj.file.url) if request else obj.file.url

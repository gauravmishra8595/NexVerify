from rest_framework import serializers

from accounts.models import User
from assessment.models import AssessmentResult


class CandidateListSerializer(serializers.ModelSerializer):
    latest_total_score = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "is_email_verified",
            "is_active",
            "role",
            "date_joined",
            "latest_total_score",
        ]

    def get_latest_total_score(self, obj):
        latest = obj.assessmentresult_set.order_by("-created_at").first()
        return latest.total_score if latest else None


class CandidateDetailSerializer(serializers.ModelSerializer):
    assessment_results = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "is_email_verified",
            "is_active",
            "role",
            "date_joined",
            "last_login",
            "assessment_results",
        ]

    def get_assessment_results(self, obj):
        results = obj.assessmentresult_set.order_by("-created_at")
        return AssessmentResultSerializer(results, many=True).data


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ["id", "dsa_score", "aptitude_score", "total_score", "created_at"]


class AnalyticsSummarySerializer(serializers.Serializer):
    total_candidates = serializers.IntegerField()
    verified_email_count = serializers.IntegerField()
    suspended_count = serializers.IntegerField()
    total_assessments_taken = serializers.IntegerField()
    average_total_score = serializers.FloatField(allow_null=True)
    new_candidates_last_7_days = serializers.IntegerField()

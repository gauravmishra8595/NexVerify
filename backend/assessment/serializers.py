from rest_framework import serializers

from .models import AssessmentResult, AssessmentSession


class PublicQuestionSerializer(serializers.Serializer):
    """
    The version of a question sent to the CLIENT - deliberately
    excludes "answer" so the correct option is never exposed to the
    browser before submission.
    """

    id = serializers.IntegerField()
    question = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField())
    difficulty = serializers.CharField()


class AssessmentSessionSerializer(serializers.ModelSerializer):
    """Returned when a session is created - questions are sanitized (no answers)."""

    questions = serializers.SerializerMethodField()

    class Meta:
        model = AssessmentSession
        fields = ["id", "assessment_type", "questions", "time_limit_seconds", "created_at"]

    def get_questions(self, obj):
        return PublicQuestionSerializer(obj.questions, many=True).data


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option = serializers.CharField(allow_blank=True)


class SubmitAssessmentSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    answers = SubmitAnswerSerializer(many=True)


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ["id", "dsa_score", "aptitude_score", "total_score", "created_at"]

from rest_framework import serializers

from .models import CandidateAnalysis


class CandidateAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateAnalysis
        fields = [
            "id",
            "resume",
            "ats_score",
            "grammar_score",
            "skill_match_score",
            "project_quality_score",
            "experience_score",
            "project_score",
            "overall_score",
            "recommendation",
            "strengths",
            "improvements",
            "missing_skills",
            "keyword_analysis",
            "created_at",
        ]

from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsVerifiedCandidate

from .models import AssessmentResult, AssessmentSession, AssessmentType
from .serializers import (
    AssessmentResultSerializer,
    AssessmentSessionSerializer,
    SubmitAssessmentSerializer,
)
from .services import generate_aptitude_questions, generate_dsa_questions

# Both assessments were bumped from 10 to 25 questions; time limits are
# scaled proportionally to keep the same per-question pacing (60s/question
# for DSA, 30s/question for aptitude).
DSA_QUESTION_COUNT = 25
APTITUDE_QUESTION_COUNT = 25
DSA_TIME_LIMIT_SECONDS = 1500  # 25 minutes
APTITUDE_TIME_LIMIT_SECONDS = 750  # 12.5 minutes


class GenerateDSAQuestionsView(APIView):
    """
    GET /api/assessment/generate/dsa/
    Creates a new AssessmentSession with fresh AI-generated (or fallback)
    DSA questions, and returns the sanitized (answer-free) version to the client.
    """

    permission_classes = [IsAuthenticated, IsVerifiedCandidate]

    def get(self, request):
        questions = generate_dsa_questions(count=DSA_QUESTION_COUNT)

        session = AssessmentSession.objects.create(
            user=request.user,
            assessment_type=AssessmentType.DSA,
            questions=questions,
            time_limit_seconds=DSA_TIME_LIMIT_SECONDS,
        )

        return Response(
            AssessmentSessionSerializer(session).data,
            status=status.HTTP_201_CREATED,
        )


class GenerateAptitudeQuestionsView(APIView):
    """
    GET /api/assessment/generate/aptitude/
    Mirrors the DSA endpoint.
    """

    permission_classes = [IsAuthenticated, IsVerifiedCandidate]

    def get(self, request):
        questions = generate_aptitude_questions(count=APTITUDE_QUESTION_COUNT)

        session = AssessmentSession.objects.create(
            user=request.user,
            assessment_type=AssessmentType.APTITUDE,
            questions=questions,
            time_limit_seconds=APTITUDE_TIME_LIMIT_SECONDS,
        )

        return Response(
            AssessmentSessionSerializer(session).data,
            status=status.HTTP_201_CREATED,
        )


class SubmitAssessmentView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedCandidate]

    def post(self, request):
        serializer = SubmitAssessmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session_id = serializer.validated_data["session_id"]
        answers = serializer.validated_data["answers"]

        try:
            session = AssessmentSession.objects.get(
                id=session_id,
                user=request.user,
            )
        except AssessmentSession.DoesNotExist:
            return Response(
                {"error": "Assessment session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if session.is_submitted:
            return Response(
                {"error": "This session has already been submitted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        correct_answers = {q["id"]: q["answer"] for q in session.questions}

        answered = {a["question_id"]: a["selected_option"] for a in answers}

        score = 0

        for qid, correct in correct_answers.items():
            if answered.get(qid) == correct:
                score += 2

        with transaction.atomic():
            session.is_submitted = True
            session.score = score
            session.submitted_at = timezone.now()
            session.save(
                update_fields=[
                    "is_submitted",
                    "score",
                    "submitted_at",
                ]
            )

            if session.assessment_type == AssessmentType.DSA:
                # Always start a fresh assessment result
                result = AssessmentResult.objects.create(
                    user=request.user,
                    dsa_score=score,
                    aptitude_score=0,
                    total_score=score,
                )
            else:
                # Update the latest DSA result waiting for aptitude
                result = (
                    AssessmentResult.objects.filter(
                        user=request.user,
                        aptitude_score=0,
                    )
                    .order_by("-created_at")
                    .first()
                )

                if result is None:
                    result = AssessmentResult.objects.create(user=request.user)

                result.aptitude_score = score
                result.total_score = result.dsa_score + result.aptitude_score
                result.save()

        return Response(
            {
                "session_id": session.id,
                "assessment_type": session.assessment_type,
                "score": score,
                "total_questions": len(session.questions),
                "result": AssessmentResultSerializer(result).data,
            }
        )


class MyLatestResultView(APIView):
    """
    GET /api/assessment/results/me/
    Returns the latest assessment result.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = (
            AssessmentResult.objects.filter(user=request.user)
            .order_by("-created_at")
            .first()
        )

        if not result:
            return Response(
                {"error": "No assessment results yet."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(AssessmentResultSerializer(result).data)


class PreloadAptitudeView(APIView):
    """
    GET /api/assessment/preload/aptitude/
    Generates aptitude questions in advance.
    """

    permission_classes = [IsAuthenticated, IsVerifiedCandidate]

    def get(self, request):
        existing = (
            AssessmentSession.objects.filter(
                user=request.user,
                assessment_type=AssessmentType.APTITUDE,
                is_submitted=False,
            )
            .order_by("-created_at")
            .first()
        )

        # Only reuse it if it actually matches the current expected question
        # count. Otherwise it's a stale session from before a question-count
        # change (or a partial/corrupted generation) and would keep getting
        # served forever since it's never marked submitted.
        if existing and len(existing.questions) == APTITUDE_QUESTION_COUNT:
            return Response(AssessmentSessionSerializer(existing).data)

        questions = generate_aptitude_questions(count=APTITUDE_QUESTION_COUNT)

        session = AssessmentSession.objects.create(
            user=request.user,
            assessment_type=AssessmentType.APTITUDE,
            questions=questions,
            time_limit_seconds=APTITUDE_TIME_LIMIT_SECONDS,
        )

        return Response(
            AssessmentSessionSerializer(session).data,
            status=status.HTTP_201_CREATED,
        )

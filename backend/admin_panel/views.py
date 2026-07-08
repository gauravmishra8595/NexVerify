import csv
from datetime import timedelta

from django.db.models import Avg, Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from accounts.models import User
from accounts.permissions import IsAdminRole
from assessment.models import AssessmentResult
from notifications.models import NotificationLog

from .serializers import (
    AnalyticsSummarySerializer,
    CandidateDetailSerializer,
    CandidateListSerializer,
)


class CandidatePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminLoginView(APIView):
    """
    POST /api/admin-panel/login/
    Same credential check as the regular login, but only succeeds for
    users with role == "ADMIN" - keeps the admin panel on its own
    login screen without a separate password system.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if user.role != "ADMIN":
            return Response({"error": "This account does not have admin access."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email,
        })


class CandidateListView(ListAPIView):
    """
    GET /api/admin-panel/candidates/?search=&verified=&is_active=&ordering=
    """

    serializer_class = CandidateListSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    pagination_class = CandidatePagination

    def get_queryset(self):
        queryset = User.objects.filter(role="USER").order_by("-date_joined")

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search)
                | Q(email__icontains=search)
                | Q(phone_number__icontains=search)
            )

        verified = self.request.query_params.get("verified")
        if verified == "email":
            queryset = queryset.filter(is_email_verified=True)
        elif verified == "none":
            queryset = queryset.filter(is_email_verified=False)

        is_active = self.request.query_params.get("is_active")
        if is_active == "true":
            queryset = queryset.filter(is_active=True)
        elif is_active == "false":
            queryset = queryset.filter(is_active=False)

        return queryset


class CandidateDetailView(RetrieveAPIView):
    """GET /api/admin-panel/candidates/<id>/"""

    queryset = User.objects.filter(role="USER")
    serializer_class = CandidateDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]


class CandidateSuspendView(APIView):
    """
    POST /api/admin-panel/candidates/<id>/suspend/
    Toggles is_active. Suspended candidates cannot log in
    (Django's default ModelBackend / our EmailBackend both
    respect is_active via authenticate()).
    """

    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            candidate = User.objects.get(pk=pk, role="USER")
        except User.DoesNotExist:
            return Response({"error": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)

        candidate.is_active = not candidate.is_active
        candidate.save(update_fields=["is_active"])

        return Response({
            "id": candidate.id,
            "is_active": candidate.is_active,
            "message": "Candidate suspended." if not candidate.is_active else "Candidate reinstated.",
        })


class CandidateDeleteView(APIView):
    """DELETE /api/admin-panel/candidates/<id>/"""

    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, pk):
        try:
            candidate = User.objects.get(pk=pk, role="USER")
        except User.DoesNotExist:
            return Response({"error": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)

        candidate.delete()
        return Response({"message": "Candidate deleted."}, status=status.HTTP_200_OK)


class CandidateExportCSVView(APIView):
    """GET /api/admin-panel/candidates/export/ - downloads all candidates as CSV."""

    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="verifyxy_candidates.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "ID", "Username", "Email", "Phone",
            "Email Verified", "Active",
            "Latest Total Score", "Joined",
        ])

        candidates = User.objects.filter(role="USER").order_by("-date_joined")

        for candidate in candidates:
            latest = candidate.assessmentresult_set.order_by("-created_at").first()
            writer.writerow([
                candidate.id,
                candidate.username,
                candidate.email,
                candidate.phone_number,
                candidate.is_email_verified,
                candidate.is_active,
                latest.total_score if latest else "",
                candidate.date_joined.strftime("%Y-%m-%d %H:%M"),
            ])

        return response


class AnalyticsSummaryView(APIView):
    """GET /api/admin-panel/analytics/summary/"""

    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        candidates = User.objects.filter(role="USER")
        seven_days_ago = timezone.now() - timedelta(days=7)

        data = {
            "total_candidates": candidates.count(),
            "verified_email_count": candidates.filter(is_email_verified=True).count(),
            "suspended_count": candidates.filter(is_active=False).count(),
            "total_assessments_taken": AssessmentResult.objects.count(),
            "average_total_score": AssessmentResult.objects.aggregate(avg=Avg("total_score"))["avg"],
            "new_candidates_last_7_days": candidates.filter(date_joined__gte=seven_days_ago).count(),
        }

        serializer = AnalyticsSummarySerializer(data)
        return Response(serializer.data)


class NotificationLogListView(APIView):
    """
    GET /api/admin-panel/notifications/?channel=&status=
    Lightweight log view for debugging OTP email delivery.
    """

    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        logs = NotificationLog.objects.all().order_by("-created_at")

        channel = request.query_params.get("channel")
        if channel:
            logs = logs.filter(channel=channel.upper())

        status_filter = request.query_params.get("status")
        if status_filter:
            logs = logs.filter(status=status_filter.upper())

        logs = logs[:200]

        data = [
            {
                "id": log.id,
                "channel": log.channel,
                "destination": log.destination,
                "status": log.status,
                "error_message": log.error_message,
                "created_at": log.created_at,
            }
            for log in logs
        ]

        return Response(data)

from django.urls import path

from .views import (
    AdminLoginView,
    AnalyticsSummaryView,
    CandidateDeleteView,
    CandidateDetailView,
    CandidateExportCSVView,
    CandidateListView,
    CandidateSuspendView,
    NotificationLogListView,
)

urlpatterns = [
    path("login/", AdminLoginView.as_view(), name="admin-login"),

    path("candidates/", CandidateListView.as_view(), name="admin-candidate-list"),
    path("candidates/export/", CandidateExportCSVView.as_view(), name="admin-candidate-export"),
    path("candidates/<int:pk>/", CandidateDetailView.as_view(), name="admin-candidate-detail"),
    path("candidates/<int:pk>/delete/", CandidateDeleteView.as_view(), name="admin-candidate-delete"),
    path("candidates/<int:pk>/suspend/", CandidateSuspendView.as_view(), name="admin-candidate-suspend"),

    path("analytics/summary/", AnalyticsSummaryView.as_view(), name="admin-analytics-summary"),
    path("notifications/", NotificationLogListView.as_view(), name="admin-notifications"),
]

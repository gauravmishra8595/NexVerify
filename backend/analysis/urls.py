from django.urls import path

from .views import MyLatestAnalysisView, RunResumeAnalysisView

urlpatterns = [
    path("run/", RunResumeAnalysisView.as_view(), name="run-analysis"),
    path("me/", MyLatestAnalysisView.as_view(), name="my-latest-analysis"),
]

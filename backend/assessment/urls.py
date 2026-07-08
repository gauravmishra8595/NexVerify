from django.urls import path

from .views import (
    GenerateAptitudeQuestionsView,
    GenerateDSAQuestionsView,
    MyLatestResultView,
    PreloadAptitudeView,
    SubmitAssessmentView,
)

urlpatterns = [
    path("generate/dsa/", GenerateDSAQuestionsView.as_view(), name="generate-dsa"),
    path("generate/aptitude/", GenerateAptitudeQuestionsView.as_view(), name="generate-aptitude"),
    path("preload/aptitude/", PreloadAptitudeView.as_view(), name="preload-aptitude"),
    path("submit/", SubmitAssessmentView.as_view(), name="submit-assessment"),
    path("results/me/", MyLatestResultView.as_view(), name="my-latest-result"),
]

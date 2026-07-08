from django.urls import path

from .views import MyResumeView, ResumeUploadView

urlpatterns = [
    path("upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("me/", MyResumeView.as_view(), name="my-resume"),
]

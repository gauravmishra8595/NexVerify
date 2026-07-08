from django.urls import path

from .views import GenerateCertificateView, MyLatestCertificateView, VerifyCertificateView

urlpatterns = [
    path("generate/", GenerateCertificateView.as_view(), name="generate-certificate"),
    path("me/", MyLatestCertificateView.as_view(), name="my-certificate"),
    path("verify/<str:certificate_id>/", VerifyCertificateView.as_view(), name="verify-certificate"),
]

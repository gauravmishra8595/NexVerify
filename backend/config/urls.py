from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("api/verify/", include("otp.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/assessment/", include("assessment.urls")),
    path("api/admin-panel/", include("admin_panel.urls")),
    path("api/resume/", include("resume.urls")),
    path("api/analysis/", include("analysis.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

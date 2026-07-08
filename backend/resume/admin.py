from django.contrib import admin

from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("user", "original_filename", "extraction_status", "uploaded_at")
    list_filter = ("extraction_status",)
    search_fields = ("user__email", "user__username", "original_filename")
    readonly_fields = ("raw_text", "parsed_data", "uploaded_at")
    ordering = ("-uploaded_at",)

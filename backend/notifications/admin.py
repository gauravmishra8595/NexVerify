from django.contrib import admin

from .models import NotificationLog


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ("channel", "destination", "status", "created_at")
    list_filter = ("channel", "status")
    search_fields = ("destination", "subject", "error_message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)

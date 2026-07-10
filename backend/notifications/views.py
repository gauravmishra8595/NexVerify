from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail

def smtp_test(request):
    send_mail(
        subject="SMTP Test",
        message="Hello from Render",
        from_email=None,
        recipient_list=["YOUR_OTHER_EMAIL@gmail.com"],
        fail_silently=False,
    )

    return JsonResponse({"status": "success"})
# Create your views here.

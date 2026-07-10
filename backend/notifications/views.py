
from django.http import JsonResponse

def smtp_test(request):
    return JsonResponse({
        "version": "SMTP TEST V2"
    })
# Create your views here.

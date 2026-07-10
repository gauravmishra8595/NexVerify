import socket
from django.http import JsonResponse

def smtp_test(request):
    try:
        ip = socket.gethostbyname("smtp.gmail.com")
        return JsonResponse({
            "resolved": ip
        })
    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)
# Create your views here.

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    email = models.EmailField(unique=True)

    phone_number = models.CharField(
        max_length=15,
        blank=True
    )

    is_email_verified = models.BooleanField(
        default=False
    )

    is_phone_verified = models.BooleanField(
        default=False
    )

    role = models.CharField(
        max_length=20,
        default="USER"
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username"]

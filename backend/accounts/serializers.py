from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "phone_number",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone_number=validated_data.get("phone_number", ""),
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Used by the /auth/me/ endpoint so the frontend reads user state
    from the DB instead of localStorage."""

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "is_email_verified",
            "role",
        ]
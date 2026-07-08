from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Grants access only to authenticated users whose `role` field is "ADMIN".

    This is independent of Django's built-in `is_staff`/`is_superuser` -
    VerifyXY's own admin role is a plain string field on the User model,
    set via the `promote_to_admin` management command.
    """

    message = "You do not have admin access."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == "ADMIN")


class IsVerifiedCandidate(BasePermission):
    """
    Grants access only to authenticated users who have verified their
    email address. WhatsApp verification was removed (paid service).
    """

    message = "Please verify your email address before starting an assessment."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        return bool(user.is_email_verified)

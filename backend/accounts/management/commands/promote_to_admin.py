from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = "Promotes an existing user to VerifyXY's ADMIN role (for accessing /admin-panel/ API endpoints)."

    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="Email of the user to promote.")

    def handle(self, *args, **options):
        email = options["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise CommandError(f"No user found with email '{email}'.")

        user.role = "ADMIN"
        user.save(update_fields=["role"])

        self.stdout.write(self.style.SUCCESS(f"'{email}' is now an ADMIN."))

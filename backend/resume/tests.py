from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ExtractionStatus, Resume
from .services import ResumeValidationError, validate_resume_file

User = get_user_model()


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


class FileValidationTests(TestCase):
    def test_rejects_non_pdf_docx_extension(self):
        f = SimpleUploadedFile("resume.exe", b"fake content", content_type="application/octet-stream")
        with self.assertRaises(ResumeValidationError):
            validate_resume_file(f)

    def test_rejects_empty_file(self):
        f = SimpleUploadedFile("resume.pdf", b"", content_type="application/pdf")
        with self.assertRaises(ResumeValidationError):
            validate_resume_file(f)

    def test_rejects_oversized_file(self):
        big_content = b"a" * (6 * 1024 * 1024)  # 6MB > 5MB cap
        f = SimpleUploadedFile("resume.pdf", big_content, content_type="application/pdf")
        with self.assertRaises(ResumeValidationError):
            validate_resume_file(f)

    def test_accepts_valid_pdf_extension(self):
        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        ext = validate_resume_file(f)
        self.assertEqual(ext, ".pdf")

    def test_accepts_valid_docx_extension(self):
        f = SimpleUploadedFile(
            "resume.docx", b"fake docx bytes",
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        ext = validate_resume_file(f)
        self.assertEqual(ext, ".docx")


class ResumeUploadViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!"
        )
        self.client = auth_client(self.user)

    def test_requires_authentication(self):
        anon = APIClient()
        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        response = anon.post("/api/resume/upload/", {"file": f}, format="multipart")
        self.assertEqual(response.status_code, 401)

    def test_no_file_returns_400(self):
        response = self.client.post("/api/resume/upload/", {}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_invalid_extension_returns_400(self):
        f = SimpleUploadedFile("resume.exe", b"bad", content_type="application/octet-stream")
        response = self.client.post("/api/resume/upload/", {"file": f}, format="multipart")
        self.assertEqual(response.status_code, 400)

    @patch("resume.views.structure_resume_with_ai")
    @patch("resume.views.extract_text")
    def test_successful_upload_and_extraction(self, mock_extract, mock_structure):
        mock_extract.return_value = "John Doe Software Engineer Python Django React"
        mock_structure.return_value = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": None,
            "education": [],
            "skills": ["Python", "Django"],
            "experience": [],
            "projects": [],
            "certifications": [],
            "cgpa": None,
            "languages": [],
            "frameworks": ["Django"],
        }

        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        response = self.client.post("/api/resume/upload/", {"file": f}, format="multipart")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["extraction_status"], "DONE")
        self.assertEqual(response.data["parsed_data"]["name"], "John Doe")

        resume = Resume.objects.get(user=self.user)
        self.assertEqual(resume.extraction_status, ExtractionStatus.DONE)
        self.assertIn("Python Django", resume.raw_text)

    @patch("resume.views.extract_text")
    def test_extraction_failure_marks_resume_failed(self, mock_extract):
        from .services import ResumeExtractionError
        mock_extract.side_effect = ResumeExtractionError("Couldn't read this file.")

        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        response = self.client.post("/api/resume/upload/", {"file": f}, format="multipart")

        self.assertEqual(response.status_code, 422)

        resume = Resume.objects.get(user=self.user)
        self.assertEqual(resume.extraction_status, ExtractionStatus.FAILED)


class MyResumeViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="cand", email="cand@gmail.com", password="StrongPass1!"
        )
        self.client = auth_client(self.user)

    def test_no_resume_yet_returns_404(self):
        response = self.client.get("/api/resume/me/")
        self.assertEqual(response.status_code, 404)

    def test_returns_latest_resume(self):
        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        Resume.objects.create(
            user=self.user,
            file=f,
            original_filename="resume.pdf",
            extraction_status=ExtractionStatus.DONE,
            parsed_data={"name": "Jane"},
        )

        response = self.client.get("/api/resume/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["parsed_data"]["name"], "Jane")

    def test_only_returns_own_resume(self):
        other = User.objects.create_user(
            username="other", email="other@gmail.com", password="StrongPass1!"
        )
        f = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf")
        Resume.objects.create(user=other, file=f, original_filename="resume.pdf")

        response = self.client.get("/api/resume/me/")
        self.assertEqual(response.status_code, 404)

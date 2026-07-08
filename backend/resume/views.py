from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ExtractionStatus, Resume
from .serializers import ResumeSerializer
from .services import (
    ResumeExtractionError,
    ResumeValidationError,
    extract_text,
    structure_resume_with_ai,
    validate_resume_file,
)


class ResumeUploadView(APIView):
    """
    POST /api/resume/upload/  (multipart/form-data, field name "file")

    Validates the file server-side, extracts text (pdfplumber/python-docx),
    then asks Gemini to structure it into education/skills/experience/etc.
    Runs synchronously within the request - there's no background job
    queue wired up yet (Celery/Redis are in requirements.txt but not
    configured), so this endpoint can take a few seconds for larger
    resumes. See backend README for the upgrade path.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ext = validate_resume_file(uploaded_file)
        except ResumeValidationError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        resume = Resume.objects.create(
            user=request.user,
            file=uploaded_file,
            original_filename=uploaded_file.name,
            extraction_status=ExtractionStatus.PROCESSING,
        )

        try:
            resume.file.open("rb")
            raw_text = extract_text(resume.file, ext)
            resume.raw_text = raw_text

            parsed_data = structure_resume_with_ai(raw_text)
            resume.parsed_data = parsed_data
            resume.extraction_status = ExtractionStatus.DONE
            resume.save(update_fields=["raw_text", "parsed_data", "extraction_status"])
        except ResumeExtractionError as exc:
            resume.extraction_status = ExtractionStatus.FAILED
            resume.extraction_error = str(exc)
            resume.save(update_fields=["extraction_status", "extraction_error"])
            return Response(
                {
                    "error": str(exc),
                    "resume": ResumeSerializer(resume, context={"request": request}).data,
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        finally:
            resume.file.close()

        return Response(
            ResumeSerializer(resume, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class MyResumeView(APIView):
    """GET /api/resume/me/ - the candidate's most recently uploaded resume, if any."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        resume = Resume.objects.filter(user=request.user).order_by("-uploaded_at").first()

        if not resume:
            return Response({"error": "No resume uploaded yet."}, status=status.HTTP_404_NOT_FOUND)

        return Response(ResumeSerializer(resume, context={"request": request}).data)

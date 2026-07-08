import io
import uuid
from datetime import datetime

import qrcode
from django.conf import settings
from django.core.files.base import ContentFile
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

from .models import SkillLevel

NAVY = colors.HexColor("#070B16")
CARD = colors.HexColor("#0F1424")
AMBER = colors.HexColor("#F5B843")
WHITE = colors.HexColor("#F5F7FA")
SLATE = colors.HexColor("#8B95A7")


def generate_certificate_id() -> str:
    year = datetime.now().year
    unique_part = uuid.uuid4().hex[:8].upper()
    return f"CERT-VXY-{year}-{unique_part}"


def derive_skill_level(overall_score: int) -> str:
    if overall_score >= 85:
        return SkillLevel.EXPERT
    if overall_score >= 65:
        return SkillLevel.ADVANCED
    if overall_score >= 40:
        return SkillLevel.INTERMEDIATE
    return SkillLevel.BEGINNER


def compute_overall_score(
    *, assessment_total: int, assessment_max: int, resume_overall_score: int | None
) -> int:
    """
    Combines assessment performance (out of assessment_max, e.g. 50 for
    25+25 questions) and resume analysis (already 0-100) into one
    0-100 overall score. If no resume analysis exists yet, the
    certificate is based on assessment performance alone.
    """
    assessment_pct = round((assessment_total / assessment_max) * 100) if assessment_max else 0

    if resume_overall_score is None:
        return assessment_pct

    return round((assessment_pct + resume_overall_score) / 2)


def _build_qr_image(verification_url: str) -> ImageReader:
    qr = qrcode.QRCode(box_size=8, border=2)
    qr.add_data(verification_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#070B16", back_color="#FFFFFF")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return ImageReader(buffer)


def generate_certificate_pdf(
    *,
    certificate_id: str,
    candidate_name: str,
    overall_score: int,
    skill_level: str,
    dsa_score: int,
    aptitude_score: int,
    generated_at: datetime,
    verification_url: str,
) -> ContentFile:
    """
    Renders the certificate as a landscape PDF using reportlab's low-level
    canvas API (precise positioning, unlike Platypus's flowing layout -
    appropriate for a fixed single-page certificate design).
    Returns a Django ContentFile ready to attach to a FileField.
    """
    buffer = io.BytesIO()
    page_size = landscape(letter)
    width, height = page_size

    c = canvas.Canvas(buffer, pagesize=page_size)

    # Background
    c.setFillColor(NAVY)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Outer border
    c.setStrokeColor(AMBER)
    c.setLineWidth(2)
    c.rect(24, 24, width - 48, height - 48, fill=0, stroke=1)

    # Inner hairline border
    c.setStrokeColor(colors.HexColor("#FFFFFF"))
    c.setLineWidth(0.5)
    c.rect(34, 34, width - 68, height - 68, fill=0, stroke=1)

    # Header: brand
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 80, "VERIFYXY")

    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2, height - 96, "VERIFY SKILLS  ·  VERIFY IDENTITY  ·  HIRE BETTER")

    # Title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 150, "Certificate of Verified Competency")

    c.setFillColor(SLATE)
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 175, "This certifies that")

    # Candidate name
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 26)
    c.drawCentredString(width / 2, height - 215, candidate_name)

    # Description line
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 11)
    c.drawCentredString(
        width / 2,
        height - 240,
        "has completed identity verification, DSA and aptitude assessments, and resume analysis on VerifyXY.",
    )

    # Score + skill level row
    mid_y = height - 300

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width / 2 - 140, mid_y, str(overall_score))
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2 - 140, mid_y - 18, "OVERALL SCORE")

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2 + 140, mid_y + 8, skill_level.title())
    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2 + 140, mid_y - 18, "SKILL LEVEL")

    # Divider
    c.setStrokeColor(colors.HexColor("#FFFFFF22"))
    c.line(width / 2 - 1, mid_y - 30, width / 2 - 1, mid_y + 25)

    # Footer: cert id, date, QR
    footer_y = 70

    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawString(60, footer_y + 14, f"Certificate ID: {certificate_id}")
    c.drawString(60, footer_y, f"Issued: {generated_at.strftime('%B %d, %Y')}")
    c.drawString(60, footer_y - 14, f"DSA: {dsa_score}  ·  Aptitude: {aptitude_score}")

    qr_image = _build_qr_image(verification_url)
    qr_size = 70
    c.drawImage(
        qr_image,
        width - 60 - qr_size,
        footer_y - 20,
        width=qr_size,
        height=qr_size,
        mask="auto",
    )

    c.showPage()
    c.save()

    buffer.seek(0)
    filename = f"{certificate_id}.pdf"
    return ContentFile(buffer.read(), name=filename)


def build_verification_url(certificate_id: str) -> str:
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    return f"{frontend_url}/certificate/verify/{certificate_id}"

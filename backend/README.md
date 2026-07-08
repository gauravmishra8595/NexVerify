# VerifyXY Backend

Django + DRF backend, PostgreSQL database.

## Feature status

| Feature | Status |
|---|---|
| Auth (register/login, JWT) | ✅ |
| Email OTP verification | ✅ |
| Admin panel API | ✅ |
| DSA + Aptitude assessments (25 questions, server-graded) | ✅ |
| Resume upload + AI extraction | ✅ |
| AI resume analysis (ATS scoring) | ✅ |
| Certificate generation (PDF + QR code) | ✅ |
| PostgreSQL | ✅ |
| WhatsApp OTP | ❌ Removed (required paid Twilio) |
| SMS OTP | ❌ Removed (required paid Twilio) |
| Celery/Redis | ❌ In requirements.txt, not configured |

## Setup

```bash
createdb verifyxy
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DB_PASSWORD, GEMINI_API_KEY, EMAIL_HOST_PASSWORD
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API overview

| Mount | App | Notes |
|---|---|---|
| `/api/accounts/` | accounts | register, `/me/` (DB user profile) |
| `/api/auth/` | authentication | login (returns JWT) |
| `/api/verify/` | otp | email OTP send + check |
| `/api/assessment/` | assessment | generate questions, submit, results |
| `/api/resume/` | resume | upload, `/me/` |
| `/api/analysis/` | analysis | run ATS analysis, `/me/` |
| `/api/certificate/` | certificate | generate, `/me/`, public verify by ID |
| `/api/admin-panel/` | admin_panel | candidates, analytics, CSV, notification logs |

## User state

All user state lives in PostgreSQL. The `/api/accounts/me/` endpoint returns the
logged-in user's profile (email, is_email_verified, role) — the frontend fetches
this on every page load via `useCurrentUser` hook rather than reading from localStorage.

## Email OTP

Four endpoints under `/api/verify/`:
- `email/send/` — sends a 6-digit code to the candidate's registered email
- `email/check/` — verifies the code, sets `User.is_email_verified = True` in the DB

OTPs expire after `OTP_EXPIRY_MINUTES` (default 10 min). Max 5 attempts before
lockout. 30-second resend cooldown. All behaviour is configurable via `.env`.

## Assessments

Both DSA and aptitude generate **25 questions** via Gemini per attempt, with a
static fallback bank if Gemini fails. Grading is entirely server-side — the client
never sees the correct answers, and cannot self-report a score. `AssessmentSession`
stores the questions + answers. `AssessmentResult` stores the final per-user scores.

## Resume analysis

1. Upload PDF/DOCX → `pdfplumber`/`python-docx` extracts raw text
2. Gemini structures text into education/skills/experience/projects/certifications/etc.
3. `POST /api/analysis/run/` → Gemini scores the resume across 6 dimensions (ATS,
   grammar, skill match, project quality, experience, project score) → 0–100 each
4. Falls back to a heuristic scorer if Gemini is unavailable

Runs synchronously in-request (no background worker). Typical latency: 3–8 seconds.

## Certificate generation

Requires all four prerequisites: email verified + DSA done + Aptitude done + resume
analysis run. Generates a landscape A4 PDF via ReportLab with a QR code (encoded
verification URL). Public verify endpoint: `GET /api/certificate/verify/<cert_id>/`
— no auth required, for recruiters scanning the QR code.

## Creating an admin user

```bash
python manage.py promote_to_admin you@example.com
```

## Running tests

```bash
python manage.py test otp assessment resume analysis certificate admin_panel
```

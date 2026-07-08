# VerifyXY Frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS frontend.

## Setup

```bash
npm install    # installs recharts + all other deps
npm run dev
```

Runs at `http://localhost:3000`. Backend must be running at `http://127.0.0.1:8000`.

## Routes

| Route | Purpose | Auth required |
|---|---|---|
| `/` | Landing page (space/starfield theme) | No |
| `/register` | Create account | No |
| `/login` | Sign in | No |
| `/dashboard` | Email OTP verification | Yes |
| `/assessment/dsa` | DSA quiz (25 questions, gated: email verified) | Yes |
| `/assessment/aptitude` | Aptitude quiz (25 questions, gated: email verified) | Yes |
| `/result` | Combined score from DB | Yes |
| `/resume` | Resume upload + extracted fields | Yes |
| `/analysis` | AI ATS analysis + charts (recharts) | Yes |
| `/certificate` | Generate + download PDF certificate | Yes |
| `/admin/login` | Admin sign-in | No |
| `/admin` | Analytics overview | Admin only |
| `/admin/candidates` | Candidate management | Admin only |
| `/admin/notifications` | Email OTP delivery logs | Admin only |

## Key design decisions

**User state comes from the DB, not localStorage.**
Only the JWT tokens (`access`/`refresh`) are stored in localStorage. The `useCurrentUser`
hook calls `GET /api/accounts/me/` on every page load to get the actual user profile,
email verification status, and role. This means the frontend is always in sync with
PostgreSQL — clearing localStorage logs you out but does not break the DB record.

**WhatsApp OTP is removed.** Twilio's WhatsApp API requires a paid account and Meta
Business approval. Only email OTP verification is supported.

**Scores never come from localStorage.** After quiz submission, `AssessmentResult` rows
are written to the DB server-side. The result page fetches from `/api/assessment/results/me/`.

## Project structure

```
app/                   Next.js App Router pages
components/
  admin/               Admin panel UI
  analysis/            ATS analysis page + recharts components
  assessment/          DSA + Aptitude quiz UI + result summary
  auth/                Login + Register forms
  certificate/         Certificate preview (TODO: full UI)
  dashboard/           OTP verification screen
  landing/             Landing page sections (Navbar, Hero, etc.)
  resume/              Resume upload + parsed fields display
  ui-custom/           Shared primitives (AuthShell, Starfield, FormField)
  ui/                  shadcn auto-generated components
services/              Axios API client functions, one file per backend app
types/                 TypeScript types matching backend serializers
hooks/
  useAuth.ts           Route guard (redirects if no JWT in localStorage)
  useAdminAuth.ts      Admin route guard
  useCurrentUser.ts    Fetches real user from DB, source of truth for user state
```

## After npm install

Run `npm run dev`. If you see a TypeScript error about recharts types, run:
```bash
npm install --save-dev @types/recharts
```
(though recharts ships its own types, this is rarely needed)

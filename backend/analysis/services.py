import json
import logging
import re

import google.generativeai as genai
from django.conf import settings

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)
_model = genai.GenerativeModel("gemini-2.5-flash")


class AnalysisError(Exception):
    pass


def _extract_json_object(raw_text: str) -> dict:
    text = raw_text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    text = re.sub(r"^```(json)?", "", text.strip())
    text = re.sub(r"```$", "", text.strip())

    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise AnalysisError("AI response did not contain a parseable JSON object.")

    return json.loads(text[start : end + 1])


_EMPTY_ANALYSIS = {
    "ats_score": 0,
    "grammar_score": 0,
    "skill_match_score": 0,
    "project_quality_score": 0,
    "experience_score": 0,
    "project_score": 0,
    "overall_score": 0,
    "recommendation": "",
    "strengths": [],
    "improvements": [],
    "missing_skills": [],
    "keyword_analysis": {"matched": [], "missing": []},
}


def _clamp_score(value) -> int:
    try:
        score = int(value)
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, score))


def analyze_resume(raw_text: str, parsed_data: dict) -> dict:
    """
    Runs Gemini over the resume's raw text + already-extracted structured
    data to produce the full ATS-style scoring breakdown. Falls back to a
    deterministic heuristic score if Gemini fails, so analysis never just
    dead-ends with nothing to show.
    """
    prompt = f"""
You are a strict, experienced ATS (Applicant Tracking System) reviewer at a
competitive tech company. You reject far more resumes than you approve, and
you are skeptical by default. Most resumes you review are mediocre. Analyze
this resume and return ONLY a raw JSON object, no markdown fences, no
commentary, in this exact shape:

{{
  "ats_score": 0-100,
  "grammar_score": 0-100,
  "skill_match_score": 0-100,
  "project_quality_score": 0-100,
  "experience_score": 0-100,
  "project_score": 0-100,
  "overall_score": 0-100,
  "recommendation": "one paragraph of overall hiring-readiness feedback",
  "strengths": ["short bullet", "short bullet", ...],
  "improvements": ["short actionable bullet", ...],
  "missing_skills": ["skill commonly expected for this candidate's apparent role that's absent"],
  "keyword_analysis": {{
    "matched": ["industry/role keywords found in the resume"],
    "missing": ["industry/role keywords that would strengthen it"]
  }}
}}

CALIBRATION - use the full 0-100 range, anchored like this:
- 0-39: Missing sections, no measurable results, unclear structure, or barely relevant to any real role.
- 40-59: Below average. Generic bullet points ("responsible for...", "worked on..."), vague impact, weak or shallow projects, inconsistent formatting.
- 60-74: Average / typical candidate. Clear structure, reasonable skills, but few or no quantified achievements (numbers, %, scale, outcomes).
- 75-84: Strong. Consistent quantified impact ("reduced latency by 30%", "handled 10k+ requests/day"), relevant and specific skills, well-structured projects with real depth.
- 85-100: Exceptional and rare. Reserve this only for resumes with extensive quantified impact across MULTIPLE roles/projects, strong technical depth, and industry-standard formatting with zero red flags. Most resumes, including decent ones, should NOT reach this band.

Do not default to a high score out of politeness or to be encouraging. A
resume with generic bullets, no metrics, or only 1-2 shallow projects must
score below 65 on ats_score and overall_score, even if it is well-formatted.
Reserve 85+ for resumes that would genuinely make a hiring manager stop
scrolling. Be specific in "improvements" about exactly what's missing
(metrics, keywords, depth) rather than generic encouragement.

Scoring guidance:
- ats_score: how well-formatted and parseable this resume would be by automated ATS software (clear sections, standard headers, no graphics-only content) AND how strong the actual content is — a clean template with weak content still scores low.
- grammar_score: writing quality, tense consistency, clarity.
- skill_match_score: breadth and relevance of listed technical skills.
- project_quality_score: depth and impact of described projects — penalize generic descriptions with no measurable outcome.
- experience_score: relevance and seniority signal in work experience.
- project_score: quantity and completeness of project descriptions.
- overall_score: your holistic assessment combining all of the above, following the calibration bands above.

Already-extracted structured data (use this for skill/keyword context):
{json.dumps(parsed_data, indent=2)[:3000]}

Raw resume text:
\"\"\"
{raw_text[:10000]}
\"\"\"
"""

    try:
        response = _model.generate_content(
            prompt,
            request_options={"timeout": 18},
        )
        parsed = _extract_json_object(response.text)

        result = dict(_EMPTY_ANALYSIS)
        for key in result:
            if key in parsed:
                result[key] = parsed[key]

        for score_field in (
            "ats_score",
            "grammar_score",
            "skill_match_score",
            "project_quality_score",
            "experience_score",
            "project_score",
            "overall_score",
        ):
            result[score_field] = _clamp_score(result[score_field])

        if not isinstance(result["strengths"], list):
            result["strengths"] = []
        if not isinstance(result["improvements"], list):
            result["improvements"] = []
        if not isinstance(result["missing_skills"], list):
            result["missing_skills"] = []
        if not isinstance(result["keyword_analysis"], dict):
            result["keyword_analysis"] = {"matched": [], "missing": []}

        result = _apply_sanity_clamp(result, raw_text, parsed_data)

        return result
    except Exception:
        logger.exception(
            "AI resume analysis failed, falling back to heuristic scoring."
        )
        return _heuristic_analysis(raw_text, parsed_data)


def _apply_sanity_clamp(result: dict, raw_text: str, parsed_data: dict) -> dict:
    """
    Gemini can still drift high even with an anchored rubric. This is a
    second, independent check: compute a rough evidence-based ceiling from
    the resume's actual extracted content, and pull ats_score/overall_score
    down toward it if the AI score is implausibly higher than what the
    underlying data supports. This never pushes scores up, only caps
    unjustified inflation.
    """
    skills = parsed_data.get("skills") or []
    experience = parsed_data.get("experience") or []
    projects = parsed_data.get("projects") or []

    projects_with_detail = sum(
        1
        for p in projects
        if isinstance(p, dict) and len(p.get("description") or "") > 60
    )
    has_quantified_impact = bool(
        re.search(r"\d+(\.\d+)?\s?(%|percent|x\b)", raw_text, flags=re.IGNORECASE)
    )

    # Evidence-based ceiling: starts modest, earns headroom for real signals.
    ceiling = 55
    ceiling += min(15, len(skills))
    ceiling += min(15, len(experience) * 8)
    ceiling += min(10, projects_with_detail * 5)
    if has_quantified_impact:
        ceiling += 10
    ceiling = min(100, ceiling)

    for field in ("ats_score", "overall_score"):
        if result[field] > ceiling:
            result[field] = ceiling

    return result


def _heuristic_analysis(raw_text: str, parsed_data: dict) -> dict:
    """
    Best-effort, non-AI fallback. Deliberately simple and explainable:
    scores are derived from how much structured data was actually found,
    not from any deep understanding of resume quality.
    """
    result = dict(_EMPTY_ANALYSIS)

    skills = parsed_data.get("skills") or []
    experience = parsed_data.get("experience") or []
    projects = parsed_data.get("projects") or []
    education = parsed_data.get("education") or []

    skill_match_score = min(100, len(skills) * 8)
    experience_score = min(100, len(experience) * 25)
    project_score = min(100, len(projects) * 20)
    project_quality_score = min(
        100,
        sum(
            20
            for p in projects
            if isinstance(p, dict) and len(p.get("description") or "") > 40
        ),
    )

    word_count = len(raw_text.split())
    ats_score = 70 if 150 <= word_count <= 1200 else 45
    grammar_score = 65  # can't meaningfully assess grammar without AI

    overall_score = round(
        (
            ats_score
            + grammar_score
            + skill_match_score
            + project_quality_score
            + experience_score
            + project_score
        )
        / 6
    )

    result.update(
        {
            "ats_score": ats_score,
            "grammar_score": grammar_score,
            "skill_match_score": skill_match_score,
            "project_quality_score": project_quality_score,
            "experience_score": experience_score,
            "project_score": project_score,
            "overall_score": overall_score,
            "recommendation": (
                "This is an automated baseline score generated without AI analysis "
                "(the AI service was unavailable). It reflects how much structured "
                "information was found on the resume, not a qualitative review."
            ),
            "strengths": [f"{len(skills)} skills listed"] if skills else [],
            "improvements": (
                ["Add more project descriptions"] if len(projects) < 2 else []
            )
            + (["List more relevant technical skills"] if len(skills) < 5 else []),
            "missing_skills": [],
            "keyword_analysis": {"matched": skills[:10], "missing": []},
        }
    )

    if not education:
        result["improvements"].append("Add your education details")

    return result

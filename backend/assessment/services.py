import json
import logging
import re

import google.generativeai as genai
from django.conf import settings

from .fallback_questions import FALLBACK_APTITUDE_QUESTIONS, FALLBACK_DSA_QUESTIONS

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

_model = genai.GenerativeModel("gemini-2.5-flash")


class QuestionGenerationError(Exception):
    pass


def _extract_json_array(raw_text: str) -> list:
    """
    Gemini sometimes wraps JSON in ```json fences, adds a leading
    sentence, or trails extra commentary. This pulls out just the
    first top-level [...] array rather than naively stripping fences,
    which breaks the moment there's any surrounding text.
    """
    text = raw_text.strip()

    # Fast path: already valid JSON.
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strip common code fences.
    text = re.sub(r"^```(json)?", "", text.strip())
    text = re.sub(r"```$", "", text.strip())

    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Last resort: find the first '[' and matching last ']'.
    start = text.find("[")
    end = text.rfind("]")

    if start == -1 or end == -1 or end <= start:
        raise QuestionGenerationError("AI response did not contain a parseable JSON array.")

    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError as exc:
        raise QuestionGenerationError(f"Could not parse AI response as JSON: {exc}") from exc


def _normalize_questions(raw_questions: list) -> list[dict]:
    """
    Assigns stable integer ids and validates shape. Drops malformed
    entries rather than failing the whole batch over one bad question.
    """
    normalized = []

    for i, q in enumerate(raw_questions):
        try:
            question_text = str(q["question"]).strip()
            options = [str(opt).strip() for opt in q["options"]]
            answer = str(q["answer"]).strip()
            difficulty = str(q.get("difficulty", "Medium")).strip().title()

            if difficulty not in ("Easy", "Medium", "Hard"):
                difficulty = "Medium"

            if not question_text or len(options) < 2 or answer not in options:
                continue

            normalized.append({
                "id": i + 1,
                "question": question_text,
                "options": options,
                "answer": answer,
                "difficulty": difficulty,
            })
        except (KeyError, TypeError):
            continue

    return normalized


def generate_dsa_questions(count: int = 25) -> list[dict]:
    prompt = f"""
Generate exactly {count} multiple-choice DSA (Data Structures & Algorithms) questions.

Mix topics across: Arrays, Strings, Linked List, Stack, Queue, Trees, BST, Graphs, DP, Greedy.
Mix difficulty across Easy, Medium, Hard.

Return ONLY a raw JSON array, no markdown fences, no commentary, in this exact shape:
[
  {{
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "...",
    "difficulty": "Easy" | "Medium" | "Hard"
  }}
]

The "answer" must be an exact, verbatim match of one of the strings in "options".
"""

    try:
        response = _model.generate_content(prompt)
        raw_questions = _extract_json_array(response.text)
        questions = _normalize_questions(raw_questions)

        if len(questions) < 4:
            raise QuestionGenerationError("AI returned too few valid questions.")

        return questions[:count]
    except Exception:
        logger.exception("DSA question generation failed, falling back to static question bank.")
        return FALLBACK_DSA_QUESTIONS[:count]


def generate_aptitude_questions(count: int = 25) -> list[dict]:
    prompt = f"""
Generate exactly {count} multiple-choice aptitude questions.

Mix topics across: Quantitative Aptitude, Logical Reasoning, Probability,
Speed Time Distance, Profit and Loss, Number Series, Blood Relations, Coding Aptitude.
Mix difficulty across Easy, Medium, Hard.

Return ONLY a raw JSON array, no markdown fences, no commentary, in this exact shape:
[
  {{
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "...",
    "difficulty": "Easy" | "Medium" | "Hard"
  }}
]

The "answer" must be an exact, verbatim match of one of the strings in "options".
"""

    try:
        response = _model.generate_content(prompt)
        raw_questions = _extract_json_array(response.text)
        questions = _normalize_questions(raw_questions)

        if len(questions) < 4:
            raise QuestionGenerationError("AI returned too few valid questions.")

        return questions[:count]
    except Exception:
        logger.exception("Aptitude question generation failed, falling back to static question bank.")
        return FALLBACK_APTITUDE_QUESTIONS[:count]

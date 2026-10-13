
import os

from dotenv import load_dotenv
from google import genai

from prompts.boundary import build_prompt

load_dotenv()

MODEL = os.getenv("GEMMA_MODEL", "gemma-4-31b-it")


def analyze_request(
    mode: str,
    terms: str,
    customer_message: str,
    tone: str = "Friendly and firm",
) -> str:
    """Analyze a customer request using the hosted Gemma model."""

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing from .env.")

    prompt = build_prompt(mode, terms, customer_message, tone)
    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    if not response.text:
        raise RuntimeError("The model returned an empty response.")

    return response.text

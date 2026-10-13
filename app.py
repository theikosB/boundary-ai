import json

from flask import Flask, jsonify, render_template, request
from services.gemma import analyze_request

app = Flask(__name__)

MAX_TEXT_LENGTH = 12000
ALLOWED_MODES = {"scope", "policy"}
ALLOWED_TONES = {
    "Friendly and firm",
    "Warm and apologetic",
    "Brief and direct",
}


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/analyze")
def analyze():
    data = request.get_json(silent=True) or {}

    mode = data.get("mode", "scope")
    terms = data.get("terms", "")
    customer_message = data.get("customer_message", "")
    tone = data.get("tone", "Friendly and firm")

    if mode not in ALLOWED_MODES:
        return jsonify({"error": "Invalid analysis mode."}), 400

    if not isinstance(terms, str) or not isinstance(customer_message, str):
        return jsonify({"error": "Agreement and request must be text."}), 400

    terms = terms.strip()
    customer_message = customer_message.strip()

    if len(terms) < 10:
        return jsonify({"error": "Please provide the agreement or policy."}), 400

    if not customer_message:
        return jsonify({"error": "Please provide the customer's request."}), 400

    if len(terms) > MAX_TEXT_LENGTH or len(customer_message) > MAX_TEXT_LENGTH:
        return jsonify({"error": "Each text field must be under 12,000 characters."}), 400

    if tone not in ALLOWED_TONES:
        tone = "Friendly and firm"

    try:
        raw_result = analyze_request(
            mode=mode,
            terms=terms,
            customer_message=customer_message,
            tone=tone,
        )
        result = json.loads(raw_result)

        required_fields = {
            "classification",
            "summary",
            "evidence",
            "uncertainties",
            "suggested_next_step",
            "draft_reply",
        }

        if not isinstance(result, dict) or not required_fields.issubset(result):
            raise ValueError("The model returned an incomplete response.")

        if not isinstance(result["evidence"], list):
            result["evidence"] = [str(result["evidence"])]

        if not isinstance(result["uncertainties"], list):
            result["uncertainties"] = [str(result["uncertainties"])]

        return jsonify(result)

    except json.JSONDecodeError:
        app.logger.exception("The model returned invalid JSON.")
        return jsonify({"error": "The AI returned an invalid response. Please try again."}), 502

    except Exception:
        app.logger.exception("Boundary analysis failed.")
        return jsonify({
            "error": "Analysis failed. The AI service may be temporarily unavailable."
        }), 502


if __name__ == "__main__":
    app.run(debug=True)

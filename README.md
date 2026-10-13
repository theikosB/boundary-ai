# Boundary

**Know where the agreement ends. Respond with confidence.**

Boundary is an AI-powered assistant for freelancers and small businesses that helps them evaluate customer requests against their existing project agreements and business policies.

Whether a client requests additional work beyond a project's agreed scope or a customer asks for a refund that conflicts with a business's policy, Boundary helps identify relevant terms, highlight uncertainties, suggest a next step, and draft a professional response.

Instead of making decisions on your behalf, Boundary gives you the context to make better-informed decisions.

## The Problem

Freelancers and small businesses regularly face situations where a customer request conflicts with an agreement, a policy, or an expectation that was never clearly established.

Handling these situations can be difficult:

- Is a client's new request included in the original project scope?
- Does a refund request meet the business's stated conditions?
- Which clauses are relevant to the situation?
- How can you respond professionally without making unsupported claims?

Boundary helps answer these questions by comparing the supplied terms with the actual request.

## Features

- **Project Scope Analysis:** Compare new client requests against an existing project agreement.
- **Customer Policy Analysis:** Evaluate customer requests against a business's refund or other policies.
- **Evidence-Based Assessment:** Surface relevant wording from the supplied terms.
- **Uncertainty Detection:** Identify missing information and ambiguous provisions.
- **Actionable Recommendations:** Suggest a practical next step.
- **AI-Drafted Responses:** Generate professional replies in different tones.
- **Simple Web Interface:** Enter your terms and request, review the assessment, and copy the suggested reply.

## How It Works

Boundary has two modes.

### 1. Project Scope

Compare a client's new request against the original project agreement.

**Example**

Agreement:

> A logo design package includes 2 initial concepts and 3 revision rounds.

Client request:

> Could you also design a business card and create 5 social media templates? I'd also like 4 additional revision rounds.

Boundary can flag the request as potentially out of scope, identify the agreed deliverables and revision limit, highlight missing pricing information, and draft a professional response.

### 2. Customer Policy

Compare a customer's request against a business's stated policy.

**Example**

Policy:

> Customers may request a refund within 14 days of purchase if the product is unused. Digital products that have been downloaded are not eligible for refunds.

Customer request:

> I bought a digital template 20 days ago and downloaded it, but I haven't used it. I'd like a full refund.

Boundary identifies the relevant policy provisions and explains why the request appears inconsistent with the supplied policy.

In both modes, the business owner remains responsible for reviewing the assessment and deciding how to proceed.

## How Boundary Approaches a Request

For every analysis, Boundary produces:

1. **Classification** — an assessment of how the request relates to the supplied agreement or policy.
2. **Evidence** — relevant wording from the provided terms.
3. **Uncertainties** — missing information or ambiguities that may affect the assessment.
4. **Suggested next step** — a practical action to consider.
5. **Draft reply** — a professional response ready for review and editing.

The goal is not simply to generate text. It is to connect a recommendation to the terms that support it while making uncertainty visible.

## Technology Stack

- **Python** — application logic
- **Flask** — web framework and API endpoints
- **Google GenAI SDK** — communication with the hosted model
- **Gemma** — open-weight language model powering the analysis
- **HTML, CSS and JavaScript** — frontend interface
- **python-dotenv** — environment variable configuration

Boundary uses hosted model inference, so the model does not need to be downloaded or run locally.

## Getting Started

### Prerequisites

- Python 3.10 or later
- A Google AI Studio API key with access to the selected model
- An internet connection

### 1. Clone the repository

```bash
git clone https://github.com/theikosB/boundary-ai
cd boundary-ai
```

### 2. Create a virtual environment

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 4. Configure your API key

Create a `.env` file in the project root, using `.env.example` as a reference.

```env
GEMINI_API_KEY=your_api_key_here
GEMMA_MODEL=gemma-4-31b-it
```

Replace the placeholder with your own API key.

**Important:** Never commit your `.env` file or expose your API key publicly. API access, quotas, availability, and possible charges depend on your provider and account.

### 5. Run Boundary

```powershell
python app.py
```

Open the following address in your browser:

http://127.0.0.1:5000

You can now choose an analysis mode, enter the relevant agreement or policy and customer request, and generate an assessment.

## Project Structure

```text
boundary-ai/
├── app.py                  # Flask application and API endpoint
├── services/
│   ├── __init__.py
│   └── gemma.py            # Hosted model integration
├── prompts/
│   ├── __init__.py
│   └── boundary.py         # Analysis instructions and prompt construction
├── templates/
│   └── index.html          # Web interface
├── static/
│   ├── style.css           # Interface styling
│   └── app.js              # Frontend interactions
├── .env.example            # Environment configuration template
├── .gitignore
├── requirements.txt
├── LICENSE
└── README.md
```

## Responsible Use

Boundary is an assistive tool, not a substitute for human judgment.

- Its assessments are based on the information supplied by the user.
- It may misunderstand a provision, miss relevant context, or generate an inaccurate response.
- A classification is an indication, not a definitive determination of contractual or legal rights.
- Users should verify the cited wording, review uncertainties, and edit suggested replies before sending them.
- Boundary should not assume that an unmentioned deliverable is automatically excluded or that every policy exception must be rejected.

**Privacy:** Agreement text, policy text, and customer requests are sent to the configured hosted model provider for inference. Do not submit confidential or personally identifiable information unless you have assessed the provider's applicable data-handling terms and have permission to share it.

## Limitations

Boundary is an initial prototype. Its reliability depends on the quality and completeness of the supplied terms and the behaviour and availability of the hosted model.

It does not independently verify contracts, enforce policies, determine legal rights, or guarantee that a suggested response is appropriate for every situation.

## Future Directions

Potential improvements include:

- Automated tests for classification accuracy and evidence grounding
- Stronger validation of model outputs
- Better handling of contradictory or incomplete terms
- More detailed explanations of the relationship between evidence and classification
- Support for additional business workflows and policy types
- Improved responsiveness and resilience to model-service failures

## Contributing

Contributions, suggestions, bug reports, and discussions are welcome.

If you find a failure case, a useful contribution is a reproducible example containing the supplied terms, the customer request, and the expected behaviour, with sensitive information removed.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
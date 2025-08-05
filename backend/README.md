# TrialMatch Backend

Simple Flask API for the TrialMatch project.  
Handles LLM extraction of patient transcripts and queries to the ClinicalTrials.gov API.

---

## Setup

Clone the repo and install dependencies:

```
pip install -r requirements.txt
```

Ensure Python 3.9+.

---

## Environment Variables

Create a `.env` file in the backend directory with your OpenAI API key:

```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

**Important**: Never commit your actual API key to Git. The `.env` file is already in `.gitignore`.

---

## Run the Server

```
python app.py
```

By default, the server runs at:  
http://localhost:5000

---

## API Endpoints

- **GET /**  
  App info.

- **GET /health**  
  Health check endpoint.

- **GET /api/openai-status**  
  Check if OpenAI API key is configured.

---

## Notes

- CORS is enabled for local frontend testing (Angular/React/etc.).  
- Port defaults to `5000` but can be overridden with the `PORT` environment variable.
- The `.env` file is automatically ignored by Git to keep your API keys secure.

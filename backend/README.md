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

---

## Notes

- CORS is enabled for local frontend testing (Angular/React/etc.).  
- Port defaults to `5000` but can be overridden with the `PORT` environment variable.

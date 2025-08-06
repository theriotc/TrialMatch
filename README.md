# TrialMatch
TrialMatch is a web app that takes patient–doctor transcripts and helps patients and providers discover relevant clinical trials. It extracts key medical information from the conversation and searches ClinicalTrials.gov for relevant studies.

## What It Does
This is a full-stack project built to make clinical trial discovery easier for patients and providers. It works by:
- **Extracting medical** info like age, diagnosis, and medications from a doctor's notes or conversation
- **Searching for trials** based on that info using the ClinicalTrials.gov API
- **Providing an easy-to-use interface** to upload, process, and review results

### Key Features
- Pulls patient demographics, conditions, and medication using OpenAI
- Shows matching clinical trials
- Summarizes a few key results for completed trials using OpenAI 
- Includes several example transcripts for testing
- Links to the full study on ClinicalTrials.gov for more details
- Works on both desktop and mobile

## Live Demo
- **Frontend**: [https://trialmatch-frontend.onrender.com/](https://trialmatch-frontend.onrender.com/)
- **Backend**: [https://trialmatch-backend.onrender.com/](https://trialmatch-backend.onrender.com/)

> **Note**: The demo may take a minute to load since it's hosted on the free tier of Render.

## Building Locally
### Requirements
- **Node.js** (v18+)
- **Python** (3.9+)
- **OpenAI API Key** (needed for transcript processing and summarizing results)

### 1. Clone the Repo
```bash
git clone https://github.com/theriotc/TrialMatch.git
cd TrialMatch
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
echo "OPENAI_API_KEY=your_api_key_here" > .env
python app.py
```
> This runs the backend at http://localhost:5000.

### 3. Frontend Setup
```bash
cd ../frontend/trial-match-app
npm install
npm start
```
> The frontend runs at http://localhost:4200.

### 4. Test it
- Visit http://localhost:4200 in your browser
- Paste in a transcript or load a sample
- Click "Process Transcript" to see results

## API Overview
### Backend
- `GET /health` - Health check
- `POST /api/process-transcript` - Process transcript with OpenAI
- `GET /api/trial/<nct_id>` - Get trial details from ClinicalTrials.gov
- `GET /api/results/<nct_id>` - Summarizes trial results if available with OpenAI

## Development Assumptions
- A full realistic transcript is provided.
    * Inputs like `Patient: Diabetes` are still accepted, as the prompt currently lacks strict validation
    * Medical information is present somewhere in input
- In memory rate limiting (10 rpm) is sufficient for this project scope
- ClinicalTrials.gov API is available and responsive
- Primary condition, intervention, and up to two comorbidities are sufficient for pulling relevant clinical trials
    * More granular filters like medication history would have been nice but sometimes leads to no results returned.
- First two results of a trial are sufficient context
    * The blob returned is too large so we only take the top 2 and summarize with OpenAI
- OpenAI correctly identifies the primary diagnosis
    * There was a case where patient has CKD, but main treatment was for diabetes. In this case, app pulled trials for CKD instead of diabetes
        * More extensive prompting could address this issue 

## Future Improvements
- Fallback for OpenAI failing to process transcript
    * Possibly through regex pattern matching
- Age and sex filters
    * This has to be done client side as it's not a field in ClinicalTrials.gov
    * Minimum Age usually provided, but not Maximum. There are categories provided like Child, Adult, Older Adult
- Display additional relevant patient details
    * Showing lab results (if any)
- Ordering trials
    * Ranking trials by relevance to patient data based on title using OpenAI
- Better summary of results
    * Having more OpenAI tokens to take the entirety of results and summarize (there were usually 10-20+ key results returned)
- User accounts
    * Allowing patients to save their medical history and relevant trials / save favorite trials for quick access
- Live transcript
    * Live audio input for transcript upload
- Relevance by medication
    * Searching for trials with other medication taken into consideration
    * Taking dosage and form (like oral vs topical) into consideration
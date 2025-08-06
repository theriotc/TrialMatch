import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get OpenAI API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# ClinicalTrials.gov API base URL
CLINICAL_TRIALS_API = "https://clinicaltrials.gov/api/v2"

def extract_patient_transcript(transcript):
    """Extract medical data from patient transcript"""
    prompt = f"""
    Analyze the following patient-doctor conversation transcript and extract key medical information in JSON format.

    If the transcript is blank, contains only whitespace, or does not clearly resemble a patient-doctor conversation with symptoms, diagnoses, or medications, RETURN: empty JSON object
     - DO NOT HALLUCINATE, DO NOT GENERATE SAMPLE DATA

    Step 1: Identify the PROVIDER'S FINAL ASSESSMENT or DIAGNOSIS section (often labeled "Assessment" or "Plan").
    Step 2: Use the first diagnosis in the assessment as primary_condition. 
    - Only use the presenting symptom as primary_condition if NO diagnosis is present.
    Step 3: Include all other diagnoses as comorbidities.

    Return ONLY a valid JSON object with this structure:
    {{
        "raw": {{
            "age": <integer>,   // Patient age in years
            "sex": "<male|female>", // If not stated, use null
            "primary_condition": "<main diagnosis or symptom as stated>",
            "comorbidities": [ "<as stated>", ... ],
            "current_medications": [ "<full med & dose as stated>", ... ],
            "intervention_interest": "<full drug/treatment as stated, if any>"
        }},
        "normalized": {{
            "age": <integer>,   // Patient age in years
            "sex": "<male|female>", // If not stated, use null
            "primary_condition": "<standardized clinical term>",
            "comorbidities": [ "<standard clinical term>", ... ],
            "current_medications": [ "<generic drug names>", ... ],
            "intervention_interest": "<generic drug name or treatment>"
        }}
    }}

    Normalization Rules:
    1. **Primary Condition & Comorbidities**
    - Use broad clinical categories for normalized values.
    - Examples:
        - "chronic kidney disease stage 3A" to "chronic kidney disease"
        - "type 2 diabetes mellitus" to "type 2 diabetes"
        - "high blood pressure" to "hypertension"
        - "mild stroke" to "stroke"

    2. **Medications & Intervention Interest**
    - raw keeps the exact name + dosage.
    - normalized must be **generic drug names only**, lowercase.
    - Examples:
        - "Jardiance 10mg once daily" to "empagliflozin"
        - "Glucophage 1000mg" to "metformin"
        - "Cozaar 100mg" to "losartan"

    3. General:
    - If a field is missing, use null or an empty list.
    - Output valid JSON only. No explanations.

    Transcript:
    {transcript}
    """
    # maybe include lab results? creatinine 1.35 egfr 58% etc
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.1
    )
    print(f"OpenAI Response: {response}")
    print(f"Response content: {response.choices[0].message.content}")

    try:
        # Parse the JSON string into a Python dictionary
        extracted_data = json.loads(response.choices[0].message.content)
        return extracted_data
    except json.JSONDecodeError as e:
        print(f"JSON Parsing Error: {e}")
        print(f"Raw response: {response.choices[0].message.content}")
        return None

def search_clinical_trials(medical_data):
    """Search ClinicalTrials.gov API for relevant trials"""
    try:
        search_terms = ""
        # Create the search query - combine terms with +
        if medical_data.get("comorbidities"):
            search_terms = "+".join(medical_data.get("comorbidities")[:2])  # Limit to 2 terms

        query_params = {
            "query.cond": medical_data.get("primary_condition", ""),
            "query.term": search_terms,
            "query.intr": medical_data.get("intervention_interest", ""),
            "fields": "NCTId,BriefTitle",
            "pageSize": 5,
        }

        api_url = f"{CLINICAL_TRIALS_API}/studies"
        print(f"Making API request to: {api_url}")
        print(f"Query parameters: {query_params}")
        response = requests.get(api_url, params=query_params)
        print(f"Full URL called: {response.url}")
        
        if response.status_code != 200:
            print(f"API Response Status: {response.status_code}")
            print(f"API Response Text: {response.text}")
            response.raise_for_status()

        data = response.json()
        print(f"API Response: {data}")

        return data

    except Exception as e:
        print(f"Error searching clinical trials: {e}")
        return []


@app.route('/')
def home():
    return jsonify({
        "app": "trial-match-backend",
        "status": "ok"
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "ok"
    })

@app.route('/api/openai-status')
def openai_status():
    if OPENAI_API_KEY:
        return jsonify({
            "status": "configured",
            "message": "OpenAI API key is set"
        })
    else:
        return jsonify({
            "status": "not_configured",
            "message": "OpenAI API key not found in environment variables"
        }), 400

@app.route('/api/process-transcript', methods=['POST'])
def process_transcript():
    """Process patient transcript"""
    try:
        data = request.get_json()
        transcript = data.get('transcript', '')
        
        if not transcript:
            return jsonify({'error': 'Transcript is required'}), 400
        
        medical_data = extract_patient_transcript(transcript)
        if not medical_data:
            return jsonify({'error': 'Failed to extract medical data'}), 500

        normalized_medical_data = medical_data.get("normalized")
        trials = search_clinical_trials(normalized_medical_data)
        
        print(f"Trials studies: {trials.get('studies')}")

        return jsonify({
            'medical_data': medical_data,
            'trials': trials,
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trial/<nct_id>', methods=['GET'])
def get_trial_details(nct_id):
    """Get details for a specific clinical trial"""
    try:
        api_url = f"{CLINICAL_TRIALS_API}/studies/{nct_id}"

        query_params = {
            "fields": "NCTId,BriefTitle,OverallStatus,StartDate,CompletionDate,StudyType,EnrollmentInfo,Sex,MinimumAge,HasResults"
        }
        # add more details on key results here

        print(f"Making API request to: {api_url}")
        print(f"Query parameters: {query_params}")
        response = requests.get(api_url, params=query_params)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch trial details'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port) 
from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get OpenAI API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port) 
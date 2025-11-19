from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from predict_model import predict_disease  # Ensure predict_model.py exists

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend communication

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/upload', methods=['POST'])
def upload():
    """Handles file upload and returns disease prediction."""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Call the prediction function
        result = predict_disease(file)  # Assuming it returns a dictionary

        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Error in /upload: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0',port=port,debug=True)  # Run Flask app


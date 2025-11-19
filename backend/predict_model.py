import joblib
import cv2
import numpy as np
from config import CATEGORIES, TREATMENTS  # Import config

# Load trained model
model = joblib.load("models/sugarcane_disease_model.pkl")

def preprocess_image(image_file):
    """Reads, processes, and prepares an image for model prediction."""
    try:
        img = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
        img = cv2.resize(img, (100, 100))
        return img.flatten().reshape(1, -1)
    except Exception as e:
        return str(e)

def predict_disease(image_file):
    """Predicts the disease from the uploaded image."""
    processed_image = preprocess_image(image_file)
    
    if isinstance(processed_image, str):  # Error check
        return {"error": processed_image}
    
    try:
        prediction = model.predict(processed_image)[0]  # Get predicted label
        disease_name = CATEGORIES[int(prediction)]  # Map to disease name
        treatment = TREATMENTS.get(disease_name, "No treatment available.")

        return {"disease": disease_name, "treatment": treatment}
    
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

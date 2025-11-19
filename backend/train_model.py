import os
import cv2
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

# Dataset Directory
DATASET_DIR = "dataset/"
CATEGORIES = ["Healthy", "RedRot", "RedRust","Mosaic","Yellow"]  # Updated categories

def load_data():
    data, labels = [], []
    
    for category in CATEGORIES:
        path = os.path.join(DATASET_DIR, category)  # Get category path
        label = CATEGORIES.index(category)  # Assign label (0,1,2)

        for img_name in os.listdir(path):  # Loop through images
            img_path = os.path.join(path, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)  # Convert to grayscale
            img = cv2.resize(img, (100, 100))  # Resize for uniformity
            
            data.append(img.flatten())  # Flatten image
            labels.append(label)  # Append category label

    return np.array(data), np.array(labels)

# Load dataset
X, y = load_data()

# Split dataset into training and testing (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train SVM Model
model = SVC(kernel='linear')
model.fit(X_train, y_train)

# Save trained model
joblib.dump(model, "models/sugarcane_disease_model.pkl")

print("✅ Model trained and saved successfully!")

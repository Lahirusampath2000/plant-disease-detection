import tensorflow as tf
import numpy as np
import cv2
import os
import matplotlib.pyplot as plt

# Define class names (based on your dataset)
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

def load_model():
    """Load the trained model"""
    print("Loading model...")
    model = tf.keras.models.load_model('plant_disease_detection_mobilenetv2model.keras')
    print("Model loaded successfully.")
    return model

def preprocess_image(image_path):
    """Load and preprocess the input image"""
    if not os.path.exists(image_path):
        print("Error: File not found.")
        return None, None  # Ensure both values are returned

    print("Processing image...")
    img = cv2.imread(image_path)
    original_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert for display
    img = cv2.resize(original_image, (128, 128))  # Resize to match model input
    img = img / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    print("Image processed successfully.")
    return img, original_image  # Return both processed & original images

def predict_disease(model, image_array, original_image):
    """Make predictions and display the result"""
    if image_array is None or original_image is None:
        print("Error: Image processing failed.")
        return  

    print("Making prediction...")
    prediction = model.predict(image_array)
    result_index = np.argmax(prediction)  # Get the class index
    predicted_class = class_names[result_index]  # Map index to class name
    print(f"Predicted Disease: {predicted_class}")

    # Display image with prediction
    plt.figure(figsize=(6, 6))
    plt.imshow(original_image)  # Use original image
    plt.title(f"Disease Name: {predicted_class}", fontsize=12)
    plt.axis('off')  # Hide axis labels
    plt.show()

if __name__ == "__main__":
    model = load_model()
    image_path = input("Enter the path of the image: ")
    image_array, original_image = preprocess_image(image_path)  

    if image_array is not None and original_image is not None:  
        predict_disease(model, image_array, original_image)

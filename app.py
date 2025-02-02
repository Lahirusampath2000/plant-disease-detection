from flask import Flask, request, jsonify
from flask_cors import CORS  # ModuleNotFoundError: No module named 'flask_cors' => pip install Flask-Cors
import os
import tensorflow as tf
import numpy as np
import cv2
from werkzeug.utils import secure_filename  # pip install Werkzeug

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = "caircocoders-ednalan"

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

# Load trained model for prediction
model = tf.keras.models.load_model('plant_disease_detection_mobilenetv2model.keras')

# Define class names for predictions
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

# Check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route for file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files[]' not in request.files:
        resp = jsonify({
            "message": 'No file part in the request',
            "status": 'failed'
        })
        resp.status_code = 400  # Return a 400 Bad Request if no file part is found
        return resp

    files = request.files.getlist('files[]')
    errors = {}
    success = False

    for file in files:
        if file and allowed_file(file.filename):  # Check if the file is allowed
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            success = True
        else:
            errors[file.filename] = 'File type is not allowed'  # Collect error for each file
            resp = jsonify({
                "message": 'File type is not allowed',
                "status": 'failed',
                "errors": errors
            })
            resp.status_code = 400  # Return 400 for invalid file types
            return resp  # Exit the loop on error and return response immediately

    if success:
        resp = jsonify({
            "message": 'Files successfully uploaded',
            "status": 'success'
        })
        resp.status_code = 201  # Return 201 Created for successful uploads
        return resp
    else:
        resp = jsonify({
            "message": 'No files were uploaded',
            "status": 'failed',
            "errors": errors
        })
        resp.status_code = 500  # Return 500 if no files were successfully uploaded
        return resp

@app.route('/predict', methods=['POST'])
def predict():
    if "files[]" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["files[]"]

    if file and allowed_file(file.filename):
        
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        file.save(file_path)

        
        try:
            image = Image.open(file_path)
            image.verify()  
        except (IOError, SyntaxError) as e:
            return jsonify({"error": "Invalid image file"}), 400

        
        img = cv2.imread(file_path)
        if img is None:
            return jsonify({"error": "Failed to read the image"}), 400

        
        try:
            img = cv2.resize(img, (128, 128))  # Resize to match model's expected input
        except cv2.error as e:
            return jsonify({"error": "Error resizing image", "details": str(e)}), 400

       
        
        return jsonify({"message": "Prediction successful"})
    else:
        return jsonify({"error": "Invalid file type. Only jpg, jpeg, and png are allowed."}), 400

if __name__ == "__main__":
    app.run(debug=True)

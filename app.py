from flask import Flask, request, jsonify,abort
from flask_cors import CORS  # ModuleNotFoundError: No module named 'flask_cors' => pip install Flask-Cors
import os
import tensorflow as tf
import numpy as np
import cv2
from werkzeug.utils import secure_filename  # pip install Werkzeug
from models import db, User
from config import ApplicationConfig
#from flask_bcrypt import Bcrypt  # pip install Flask-Bcrypt
from PIL import Image
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_mysqldb import MySQL
import bcrypt
from flask import session



app = Flask(__name__)
CORS(app, supports_credentials=True)



#app.config.from_object(ApplicationConfig)

#bcrypt= Bcrypt(app)
#db.init_app(app)

#with app.app_context():
    #db.create_all()

#sql config
# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'plant_disease_detection'
app.secret_key = 'your_secret_key_here'


mysql = MySQL(app)

class RegisterForm(FlaskForm):
    name = StringField("Name",validators=[DataRequired()])
    email = StringField("Email",validators=[DataRequired(), Email()])
    password = PasswordField("Password",validators=[DataRequired()])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    email = StringField("Email",validators=[DataRequired(), Email()])
    password = PasswordField("Password",validators=[DataRequired()])
    submit = SubmitField("Login")

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB


ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

""

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

#Route for home page
@app.route('/', methods=['POST'])
def index():
    return jsonify({"message": "Welcome to Plant Disease Detection system"})

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    # Get the JSON data from the request
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Check if all fields are provided
    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store data in the database
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed_password))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Registration successful"}), 201

@app.route('/login', methods=['GET' , 'POST'])
def login():
    # Get the JSON data from the request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if all fields are provided
    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Get the user from the database
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    # Check if the user exists
    if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):  
        session['user_id'] = user[0]
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    

    
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


# Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if "files[]" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["files[]"]

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Read and preprocess image
        img = cv2.imread(file_path)
        if img is None:
            return jsonify({"error": "Failed to read the image"}), 400

        original_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(original_img, (128, 128)) / 255.0
        img_batch = np.expand_dims(img_resized, axis=0)

        prediction = model.predict(img_batch)
        result_index = np.argmax(prediction)
        predicted_class = class_names[result_index]
        confidence = float(prediction[0][result_index])

        return jsonify({
            "status": "success",
            "prediction": predicted_class,
            "confidence": confidence
        }), 200
    else:
        return jsonify({"error": "Invalid file type. Only jpg, jpeg, png, and gif are allowed."}), 400



if __name__ == "__main__":
    app.run(debug=True)


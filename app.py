from flask import Flask, request, jsonify,abort
from flask_cors import CORS  # ModuleNotFoundError: No module named 'flask_cors' => pip install Flask-Cors
import os
import tensorflow as tf
import numpy as np
import cv2
from werkzeug.utils import secure_filename  # pip install Werkzeug
from models import db, User

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
    "Apple Scab", "Apple Black Rot", "Apple Cedar Apple Rust", "Apple Healthy",
    "Blueberry Healthy", "Cherry (Including Sour) Powdery Mildew", "Cherry (Including Sour) Healthy",
    "Corn (Maize) Cercospora Leaf Spot Gray Leaf Spot", "Corn (Maize) Common Rust", "Corn (Maize) Northern Leaf Blight",
    "Corn (Maize) Healthy", "Grape Black Rot", "Grape Esca (Black Measles)", "Grape Leaf Blight (Isariopsis Leaf Spot)",
    "Grape Healthy", "Orange Haunglongbing (Citrus Greening)", "Peach Bacterial Spot", "Peach Healthy",
    "Pepper Bell Bacterial Spot", "Pepper Bell Healthy", "Potato Early Blight", "Potato Late Blight", "Potato Healthy",
    "Raspberry Healthy", "Soybean Healthy", "Squash Powdery Mildew", "Strawberry Leaf Scorch", "Strawberry Healthy",
    "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight", "Tomato Leaf Mold", "Tomato Septoria Leaf Spot",
    "Tomato Spider Mites (Two-Spotted Spider Mite)", "Tomato Target Spot", "Tomato Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus", "Tomato Healthy"
]


# Check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#Route for home page
@app.route('/', methods=['POST'])
def index():
    return jsonify({"message": "AI POWERED PLANT DISEASE DETECTION SYSTEM"}), 200

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

        #fetch treatment plan
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT TreatmentPlan FROM plant_diseases WHERE DiseaseName = %s", (predicted_class,))
        treatment_plan = cursor.fetchone()
        cursor.close()
        
        if treatment_plan:
            treatment_plan = treatment_plan[0]  # Extract the treatment plan as a string
        else:
            treatment_plan = "No treatment plan available for this disease."

        return jsonify({
            "status": "success",
            "prediction": predicted_class,
            "confidence": confidence,
            "treatment_plan": treatment_plan
        }), 200
    else:
        return jsonify({"error": "Invalid file type. Only jpg, jpeg, png, and gif are allowed."}), 400



if __name__ == "__main__":
    app.run(debug=True)


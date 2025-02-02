import os
import sys
import json
import pytest
from io import BytesIO

# Ensure the app module is found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app  # Correct import

@pytest.fixture
def client():
    """Set up test client for Flask app."""
    app.config["TESTING"] = True
    app.config["UPLOAD_FOLDER"] = "test_uploads"
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    with app.test_client() as client:
        yield client  # Provide test client to tests

    # Cleanup test uploads
    for file in os.listdir(app.config["UPLOAD_FOLDER"]):
        os.remove(os.path.join(app.config["UPLOAD_FOLDER"], file))
    os.rmdir(app.config["UPLOAD_FOLDER"])

def test_upload_file(client):
    """Test file upload endpoint with a valid image."""
    data = {
        "files[]": (BytesIO(b"test_image_data"), "test_image.jpg")  # Simulating image upload
    }
    response = client.post("/upload", content_type="multipart/form-data", data=data)
    
    # Convert response to JSON
    response_json = json.loads(response.data)
    
    assert response.status_code == 201
    assert response_json["status"] == "success"

def test_upload_invalid_file(client):
    """Test uploading an invalid file format (e.g., .txt instead of image)."""
    data = {
        "files[]": (BytesIO(b"test_file_data"), "test_file.txt")  # Not an allowed type
    }
    response = client.post("/upload", content_type="multipart/form-data", data=data)
    
    response_json = json.loads(response.data)
    
    assert response.status_code == 400  # Typically, failures return 400 Bad Request
    assert response_json["status"] == "failed"

def test_predict(client):
    """Test prediction endpoint with an image file."""
    data = {
        "files[]": (BytesIO(b"test_image_data"), "test_image.jpg")
    }
    response = client.post("/predict", content_type="multipart/form-data", data=data)
    
    response_json = json.loads(response.data)

    assert response.status_code == 200
    assert "prediction" in response_json  # Ensuring prediction key exists in response

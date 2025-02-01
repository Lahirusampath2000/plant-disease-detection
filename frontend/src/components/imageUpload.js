import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [responseMsg, setResponseMsg] = useState({ status: "", message: "", error: "" });
  const [prediction, setPrediction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle file upload
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("files[]", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setUploadedImage(URL.createObjectURL(image)); // Display uploaded image
        setResponseMsg({ status: "success", message: "Successfully uploaded the image" });
      }
    } catch (error) {
      console.error(error);
      setResponseMsg({ status: "failed", message: "Upload failed. Try again." });
    }
  };

  // Handle image prediction
  const predictDisease = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("files[]", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setPrediction(response.data.prediction);
        setResponseMsg({ status: "success", message: `Prediction: ${response.data.prediction}` });
      }
    } catch (error) {
      console.error(error);
      setResponseMsg({ status: "failed", message: "Prediction failed. Try again." });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", position: "relative" }}>
      {/* Form Container */}
      <div
        className="container"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
          zIndex: 2,
          maxWidth: "500px",  // Add maximum width to control the form width
          width: "100%",
        }}
      >
        <h1>Upload Image & Predict Plant Disease</h1>
        <br />
        {responseMsg.status === "success" && <div className="alert alert-success">{responseMsg.message}</div>}
        {responseMsg.error && <div className="alert alert-danger">{responseMsg.error}</div>}
        <br />

        <form id="imageForm" encType="multipart/form-data">
          <label htmlFor="formFile">Select an image:</label>
          <br />
          <input id="formFile" className="form-control" type="file" onChange={handleFileChange} />
          <br />
          <button type="button" className="btn btn-primary" onClick={uploadImage} style={{ marginRight: "15px" }}>Upload Image</button>
          <button type="button" className="btn btn-secondary" onClick={predictDisease}>Predict Image</button>
        </form>

        {uploadedImage && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Uploaded Image:</h3>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        )}

        {prediction && (
          <div>
            <h3>Predicted Disease Class: {prediction}</h3>
          </div>
        )}
      </div>

      {/* Background Blur Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/images/plantimg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default ImageUpload;

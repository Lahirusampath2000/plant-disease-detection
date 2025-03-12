import React, { useState } from "react";
import axios from "axios";
import { X } from 'lucide-react';


const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [responseMsg, setResponseMsg] = useState({ status: "", message: "", error: "" });
  const [prediction, setPrediction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [displayTreatmentPlanbtn, setDisplayTreatmentPlanbtn] = useState(false);
  const [treatment_plan, setTreatmentPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);  // Modal visibility state

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setDisplayTreatmentPlanbtn(false);
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setUploadedImage(URL.createObjectURL(image));
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setPrediction(response.data.prediction);
        setTreatmentPlan(response.data.treatment_plan); // Assuming the backend sends treatment plan data
        setDisplayTreatmentPlanbtn(true);
      }
    } catch (error) {
      console.error(error);
      setResponseMsg({ status: "failed", message: "Prediction failed. Try again." });
      setDisplayTreatmentPlanbtn(false);
    }
  };

  // Open the treatment plan popup widow
  const openPopup = () => {
    setShowPopup(true);
  };

  // Close the treatment plan popup window
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        backgroundImage: "url('/images/plantimg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
          zIndex: 2,
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1>GreenShield</h1>
        <br />
        {responseMsg.status === "success" && <div style={{ color: "green" }}>{responseMsg.message}</div>}
        {responseMsg.error && <div style={{ color: "red" }}>{responseMsg.error}</div>}
        <br />

        <form id="imageForm" encType="multipart/form-data">
          <label htmlFor="formFile">Select an image:</label>
          <br />
          <input id="formFile" type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
          <br />
          <button
            type="button"
            onClick={uploadImage}
            style={{
              marginRight: "15px",
              padding: "10px 15px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={predictDisease}
            style={{
              padding: "10px 15px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Predict Image
          </button>
        </form>

        {uploadedImage && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Uploaded Image:</h3>
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "5px" }}
            />
          </div>
        )}

        {prediction && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#e3f2fd",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <h3>Predicted Disease: {prediction}</h3>
          </div>
        )}

        {displayTreatmentPlanbtn && (
          <button
            onClick={openPopup}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            View Treatment Plan
          </button>
        )}
      </div>

     
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              padding: "50x",
              borderRadius: "10px",
              width: "50%",
              height: "400px",
              textAlign: "center",
              color: "black",
            }}
          >
            <h3>Treatment Plan</h3>
            <p>{treatment_plan}</p>
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                background: "none",
                border: "none",
                fontSize: "20px",
                color: "black",
                cursor: "pointer",
                
              }}
              onMouseEnter={(e) => (e.target.style.color = "red")}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              <X/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

import React, { useState } from "react";
import axios from "axios";

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
        //setResponseMsg({ status: "success", message: `Prediction: ${response.data.prediction}` });
      }
    } catch (error) {
      console.error(error);
      setResponseMsg({ status: "failed", message: "Prediction failed. Try again." });
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      position: "relative",
      backgroundImage: "url('/images/plantimg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
        zIndex: 2,
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
      }}>
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
          <button type="button" onClick={uploadImage} style={{ marginRight: "15px", padding: "10px 15px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Upload Image
          </button>
          <button type="button" onClick={predictDisease} style={{ padding: "10px 15px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Predict Image
          </button>
        </form>

        {uploadedImage && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Uploaded Image:</h3>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "100%", height: "auto", borderRadius: "5px" }} />
          </div>
        )}

        {prediction && (
          <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e3f2fd", borderRadius: "5px", textAlign: "center" }}>
            <h3>Predicted Disease : {prediction}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

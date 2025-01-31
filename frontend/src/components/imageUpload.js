import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [images, setImages] = useState([]);
  const [responseMsg, setResponseMsg] = useState({ status: "", message: "", error: "" });

  // Image change handler
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = [];

    files.forEach((file) => {
      if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
        validImages.push(file);
      } else {
        setResponseMsg({ ...responseMsg, error: "Only JPG, PNG, and JPEG files are allowed" });
      }
    });

    setImages(validImages);
  };

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please select at least one valid image");
      return;
    }

    const data = new FormData();
    images.forEach((image) => data.append("files[]", image));

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", data);
      if (response.status === 201) {
        setResponseMsg({ status: "success", message: "Successfully Uploaded" });
        setTimeout(() => setResponseMsg({ status: "", message: "", error: "" }), 3000);
        setImages([]);
        document.getElementById("imageForm").reset();
      }
    } catch (error) {
      console.error(error);
      setResponseMsg({ status: "failed", message: "Upload failed. Try again." });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", padding: "20px", position: "relative" }}>
      {/* Form Container */}
      <div
        className="container"
        style={{
          position: "absolute",
          left: "60%",
          top: "300%",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "40px",
          borderRadius: "10px",
          overflowY: "auto",
        }}
      >
        <h1>Upload an Image</h1>
        <br />
        {responseMsg.status === "success" && <div className="alert alert-success">{responseMsg.message}</div>}
        {responseMsg.error && <div className="alert alert-danger">{responseMsg.error}</div>}
        <br />

        <form id="imageForm" onSubmit={submitHandler} encType="multipart/form-data">
          <label htmlFor="formFile">Select an image:</label>
          <br />
          <input id="formFile" className="form-control" type="file" multiple onChange={handleChange} />
          <br />
          <div >
            <button type="submit" className="btn btn-primary" style={{ marginRight: "10px" }}>
              submit
            </button>
            <button type="submit" className="btn btn-success">
              Predict
            </button>
          </div>
          
        </form>
      </div>

      {/* Background Blur Image */}
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/images/plantimg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          filter: "blur(8px)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      ></div>
    </div>
  );
}

export default ImageUpload;

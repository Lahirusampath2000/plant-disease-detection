import React from "react";


function ImageUpload() {
  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "20px",
        position: "relative",
        
      }}
    >
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
        <br />
        <label htmlFor="formFile">Select an image:</label>
        <br />
        <br />
        {/* This is the file input that will be turned into Dropzone */}
        <input
          id="formFile"
          className="form-control"
          type="file"
          style={{ width: "20%" }}
        />
        <br />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>

      <div
        style={{
          flex: 1,
          backgroundImage: "url('/images/plantimg.png')", // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh", // Ensure it takes up full viewport height
          filter: "blur(8px)", // Apply the blur effect to the background
          position: "absolute", // Position behind the form
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

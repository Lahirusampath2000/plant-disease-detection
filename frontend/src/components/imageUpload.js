import React from "react";

function ImageUpload() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
        <div className="container"></div>
        <h1>Upload an Image</h1>
      <form method="post" encType="multipart/form-data" >
        <label for="image">Select an image:</label>
        <br/>
        <br/>
        <input type="file" id="image" name="image" accept="image/*" />
        <br/>
        <br/>
        <button type="submit" class="btn btn-primary">Submit</button>
        
        

      </form>
      
      
    </div>
  );
}
export default ImageUpload;
import React from "react";

function ImageUpload() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start", // You can set this to "flex-start" or "center"
        padding: "20px",
        position: "relative",
      }}
    >
        <div className="container" 
        style={{
          position: "absolute", // You can use absolute positioning for more control
          left: "65%",
          top: "300%", 
        }}>
            <h1>Upload an Image</h1>
            <br/>
            <br/>
            <form method="post" encType="multipart/form-data" >
                <label for="image">Select an image:</label>
                <br/>
                <br/>
                <input class="form-control" type="file" id="formFile" style={{ width: "20%" }} />
                <br/>
                <br/>
                <button type="submit" class="btn btn-primary">Submit</button>
                
            

            </form>

        </div>
       
      
      
    </div>
  );
}
export default ImageUpload;
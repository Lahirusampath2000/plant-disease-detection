import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is the home page. You can go to the upload page to upload images.</p>
      <Link to="/upload">Go to Image Upload Page</Link>
    </div>
  );
}

export default HomePage;

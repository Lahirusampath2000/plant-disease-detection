import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessage("Error connecting to the API");
      }
    };

    fetchMessage();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px", position: "relative" }}>
      <h1 style={styles.brandingText}>GreenShield</h1>
      <p>{message}</p>
      <button
        className="btn btn-primary"
        style={{
          position: "absolute",
          right: "300px",
          top: "360px",
          padding: "15px 30px",
          fontSize: "20px",
        }}
        onClick={() => (window.location.href = "/login")}  
      >
        Login
      </button>
    </div>
  );
};
const styles = {
  brandingText: {
    fontSize: "40px",
    color: "#2ecc71",
  },
}

export default HomePage;

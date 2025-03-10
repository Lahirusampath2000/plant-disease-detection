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
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <h1 style={styles.brandingText}>GreenShield</h1>
      <p style={styles.title2}>
        {message.split('').map((char, index) => (
          <span
            key={index}
            style={{
              opacity: 0,
              animation: `fadeIn 0.6s forwards`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            {char}
          </span>
        ))}
      </p>
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
    fontSize: "60px",
    color: "#2ecc71",
  },
  title2: {
    fontSize: "30px",
    color: "#333",
    margin: "20px 0",
  },
};

export default HomePage;

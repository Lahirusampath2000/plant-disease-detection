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
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Plant Disease Detection</h1>
      <p>{message}</p>
    </div>
  );
};

export default HomePage;

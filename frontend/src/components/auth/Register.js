import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message);
      navigate("/"); // Redirect to Login page after registration
    } catch (error) {
      alert("Error during registration!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>GreenShield</h2>
        <br></br>
        <h3>GET STARTED NOW</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <br></br>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <br></br>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <br></br>
          <button type="submit" className="btn btn-dark mt-4">
            Signup
          </button>
          <br></br>
          <h4>Have an account? sign in</h4>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end", // Align content to the right
    alignItems: "center",
    height: "100vh", // Full screen height
    paddingRight: "10%", // Adjust right padding for better positioning
    backgroundColor: "#f1f1f1", // Light background for contrast
  },
  formContainer: {
    width: "40%", // Takes half of the page
    height: "90vh", // Full viewport height
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Center content vertically
    padding: "40px",
    backgroundColor: "#fff", // Light background for contrast
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
  },
  form: {
    width: "100%", // Ensure the form takes full width inside the container
  },
};

export default Register;

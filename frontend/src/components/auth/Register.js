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
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
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
        {/* GreenShield Branding */}
        <div style={styles.branding}>
          <h2 style={styles.brandingText}>GreenShield</h2>
        </div>

        <h3 style={styles.heading}>GET STARTED NOW</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              style={styles.input}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={styles.input}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark mt-4" style={styles.button}>
            Signup
          </button>

          <div style={styles.signInContainer}>
            <h4>
              Have an account? <a href="/login">Sign in</a>
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100vh",
    paddingRight: "10%",
    backgroundImage: "url('/images/login.jpg')", // Set background image
    backgroundSize: "cover",
  },
  formContainer: {
    width: "40%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  branding: {
    marginBottom: "10px",
  },
  brandingText: {
    color: "#1F6A3C", // Green color
    fontFamily: "'Poppins', sans-serif",
    fontSize: "40px",
    fontWeight: "bold",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "40px",
  },
  form: {
    width: "100%",
    textAlign: "left", // Align form elements to the left
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  signInContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
};

export default Register;

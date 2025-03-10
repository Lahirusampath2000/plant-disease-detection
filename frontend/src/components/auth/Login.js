import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message);
      navigate("/upload-image"); // Redirect after login
    } catch (error) {
      alert(error.response?.data?.message || "Error during login!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Branding */}
        <div style={styles.branding}>
          <h2 style={styles.brandingText}>GreenShield</h2>
        </div>

        <h3 style={styles.heading}>WELCOME BACK</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
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
            Login
          </button>

          {/* Sign-up link at the bottom */}
          <div style={styles.signUpContainer}>
            <h4>
              Don't have an account? <Link to="/register">Sign up</Link>
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
    backgroundImage: "url('/images/login.jpg')", // Background image
    backgroundSize: "cover",
  },
  formContainer: {
    width: "40%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  branding: {
    marginBottom: "40px",
  },
  brandingText: {
    color: "#2E8B57",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "40px",
    fontWeight: "bold",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  form: {
    width: "100%",
    textAlign: "left",
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
  signUpContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
};

export default Login;

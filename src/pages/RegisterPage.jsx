import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/register", { name, email, password, mobilenumber });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #1a0324 0%, #43126b 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          color: "#fff",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-light brand-font">🎬 CineAura</h2>
          <p className="text-white-50 mb-0">Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Full Name</label>
            <input
              type="text"
              className="form-control bg-transparent text-light border-light"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Email Address</label>
            <input
              type="email"
              className="form-control bg-transparent text-light border-light"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control bg-transparent text-light border-light"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light">Mobile Number</label>
            <input
              type="text"
              className="form-control bg-transparent text-light border-light"
              value={mobilenumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-light w-100 fw-semibold py-2 shadow-sm"
            style={{ borderRadius: "10px" }}
          >
            Register
          </button>
        </form>

        <p className="text-center text-white-50 mt-4 mb-0">
          Already have an account?{" "}
          <span
            className="text-warning fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Extra Styles */}
      <style>{`
        .brand-font {
          font-family: 'Cinzel Decorative', cursive;
          letter-spacing: 1px;
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.15);
        }
        .btn-light:hover {
          background-color: #f0e6ff;
          color: #1a0324;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;

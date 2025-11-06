// src/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/users/login", { email, password });

      if (res.data && res.data.user && res.data.token) {
        login(res.data); // ✅ persist user & token
        navigate("/dashboard");
      } else {
        alert("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #1a0324 0%, #43126b 100%)",
        fontFamily: "'Poppins', sans-serif",
        margin: "0",
        padding: "0",
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          color: "#fff",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-light brand-font">🎬 CineAura</h2>
          <p className="text-white-50 mb-0">Welcome back! Please log in</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light fw-semibold">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-light text-light">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                id="email"
                className="form-control bg-transparent text-light border-light"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-light fw-semibold">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-light text-light">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                id="password"
                className="form-control bg-transparent text-light border-light"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-light fw-semibold py-2 shadow-sm"
              style={{ borderRadius: "10px" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-white-50 mb-0">
            Don’t have an account?{" "}
            <span
              className="text-warning fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
          height: 100%;
          background: linear-gradient(135deg, #1a0324 0%, #43126b 100%);
        }
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

export default LoginPage;

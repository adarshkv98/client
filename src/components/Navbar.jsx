import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-3"
      style={{
        background: "linear-gradient(90deg, #0f0c29, #302b63, #24243e)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      <div className="container">
        {/* 🔗 CineAura logo also links to Home */}
        <Link
          to="/"
          className="navbar-brand fw-bold text-white"
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            letterSpacing: "1px",
            fontSize: "1.5rem",
            textDecoration: "none",
          }}
        >
          CineAura
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-uppercase fw-semibold">
            <li className="nav-item">
              <Link className="nav-link text-light px-3" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light px-3" to="/register">
                Register
              </Link>
            </li>

            {user ? (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link text-light px-3 bg-transparent border-0"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-light px-3" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 🎨 Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap"
        rel="stylesheet"
      />
    </nav>
  );
};

export default Navbar;

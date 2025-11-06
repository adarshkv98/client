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
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #1a0033, #3a006e)",
        padding: "15px 50px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <div className="container-fluid">
        {/* ✅ Logo */}
        <Link
          to="/"
          className="navbar-brand fw-bold"
          style={{
            fontSize: "1.8rem",
            letterSpacing: "1px",
            color: "#fff",
            fontFamily: "Cinzel, serif",
          }}
        >
          CINEAURA
        </Link>

        <div className="d-flex align-items-center gap-4">
          {/* ✅ If user logged in → show Dashboard + Profile + Logout */}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="nav-link text-light fw-semibold"
                style={{ fontSize: "1rem" }}
              >
                MOVIES
              </Link>

              <Link
                to="/profile/me"
                className="nav-link text-light fw-semibold"
                style={{ fontSize: "1rem" }}
              >
                PROFILE
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-sm"
                style={{
                  backgroundColor: "#fca311",
                  color: "#1a0033",
                  fontWeight: "600",
                  borderRadius: "20px",
                  padding: "6px 14px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* ✅ Before login → show Home + Register + Login */}
              <Link
                to="/"
                className="nav-link text-light fw-semibold"
                style={{ fontSize: "1rem" }}
              >
                HOME
              </Link>

              <Link
                to="/register"
                className="nav-link text-light fw-semibold"
                style={{ fontSize: "1rem" }}
              >
                REGISTER
              </Link>

              <Link
                to="/login"
                className="nav-link text-light fw-semibold"
                style={{ fontSize: "1rem" }}
              >
                LOGIN
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

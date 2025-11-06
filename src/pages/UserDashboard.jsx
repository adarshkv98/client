import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("/movies");
        if (Array.isArray(res.data.movies)) setMovies(res.data.movies);
        else setMovies([]);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );

  return (
    <>
      <div
        className="dashboard-page text-light d-flex flex-column"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a0324, #230a41)",
          overflow: "visible", // ✅ allow normal scrolling only on body
        }}
      >
        {/* 🌌 Navbar */}
        <nav
          className="navbar navbar-expand-lg navbar-dark px-4 py-3"
          style={{
            background: "linear-gradient(90deg, #0f0c29, #302b63, #24243e)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            className="fw-bold text-light brand-font mb-0"
            style={{
              fontFamily: "'Cinzel Decorative', cursive",
              letterSpacing: "1px",
              fontSize: "1.6rem",
            }}
          >
            CineAura
          </h2>

          <div className="ms-auto d-flex align-items-center">
            <span className="me-3 text-light">
              👋 Welcome, <strong>{user?.name || "User"}</strong>
            </span>
            <button
              className="btn btn-sm text-light fw-semibold"
              style={{
                background: "linear-gradient(90deg, #6a11cb 0%, #b5179e 100%)",
                border: "none",
                borderRadius: "8px",
                padding: "6px 14px",
                boxShadow: "0 3px 10px rgba(181, 23, 158, 0.5)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.boxShadow =
                  "0 3px 20px rgba(181, 23, 158, 0.8)")
              }
              onMouseOut={(e) =>
                (e.target.style.boxShadow =
                  "0 3px 10px rgba(181, 23, 158, 0.5)")
              }
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* 🌟 Hero Section */}
        <div className="text-center py-5 m-0">
          <h1 className="fw-bold display-5 text-white brand-font glow-text mb-3">
            Welcome to CineAura
          </h1>
          <p className="text-secondary fs-5 m-0">
            Browse and book your favorite movies!
          </p>
        </div>

        {/* 🎥 Movies Grid */}
        <div className="container-fluid px-4 pb-5">
          <div className="row g-4 justify-content-center m-0">
            {movies.length === 0 ? (
              <p className="text-center text-light mt-5">
                No movies available right now.
              </p>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie._id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div
                    className="card border-0 shadow-lg h-100 movie-card"
                    style={{
                      borderRadius: "1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      cursor: "pointer",
                      overflow: "hidden",
                      backdropFilter: "blur(5px)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={() => navigate(`/movies/${movie._id}`)}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="card-img-top"
                      style={{
                        height: "360px",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x600?text=No+Image";
                      }}
                    />
                    <div className="card-body text-center p-3">
                      <h5 className="card-title text-light fw-semibold mb-2 text-truncate">
                        {movie.title}
                      </h5>
                      <p className="text-warning small mb-3">
                        ⭐ {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                      </p>
                      <button
                        className="btn btn-outline-light btn-sm w-100"
                        onClick={() => navigate(`/movies/${movie._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✨ Custom CSS */}
        <style>{`
          * {
            font-family: 'Poppins', sans-serif;
          }

          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-y: auto; /* ✅ Only this scrollbar remains */
            overflow-x: hidden;
            background-color: #1a0324;
          }

          .dashboard-page {
            overflow: visible !important; /* ✅ Removes inner scroll */
          }

          .brand-font {
            font-family: 'Cinzel Decorative', cursive;
            letter-spacing: 2px;
          }

          .movie-card:hover {
            transform: scale(1.03);
          }

          .movie-card:hover img {
            transform: scale(1.05);
          }

          .glow-text {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
          }

          footer {
            margin-top: auto;
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;

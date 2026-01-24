import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("https://server-eom8.onrender.com/api/movies");
        if (Array.isArray(res.data.movies)) setMovies(res.data.movies);
        else if (Array.isArray(res.data)) setMovies(res.data);
        else setMovies([]);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h4>{error}</h4>
      </div>
    );

  return (
    <div
      className="min-vh-100 text-light"
      style={{
        background: "linear-gradient(135deg, #1b0a2a 0%, #6a11cb 40%, #b5179e 100%)",
      }}
    >
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Hero Section */}
      <div
        className="position-relative text-center py-5 mb-5"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "65vh",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
        <div className="position-absolute top-50 start-50 translate-middle">
          <h1 className="fw-bold display-3 text-white brand-font glow-text">
            🎬 CineAura
          </h1>
          <p className="lead text-light-50">
            Feel the Magic of Cinema in Every Frame
          </p>
          <a
            href="#movies"
            className="btn btn-lg gradient-btn shadow mt-3 fw-bold"
          >
            Explore Now →
          </a>
        </div>
      </div>

      {/* Movie Section */}
      <div id="movies" className="container py-5">
        <h2 className="text-center fw-bold mb-5 section-heading">
          Now Showing
        </h2>
        {movies.length === 0 ? (
          <p className="text-center text-light opacity-75">
            No movies available right now.
          </p>
        ) : (
          <div className="row g-4 justify-content-center">
            {movies.map((movie) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={movie._id}
              >
                <div
                  className="card border-0 shadow-lg movie-card h-100"
                  style={{
                    borderRadius: "1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="position-relative">
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
                  </div>
                  <div className="card-body text-center text-light">
                    <h5 className="card-title fw-semibold mb-2 text-truncate">
                      {movie.title}
                    </h5>
                    <p className="text-light small mb-3">
                      ⭐ {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                    </p>
                    <button
                      onClick={() => handleViewDetails(movie._id)}
                      className="btn btn-sm w-100 gradient-btn fw-semibold"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`

      body{
       background-color: #120020 !important;
      }
        * {
          font-family: 'Poppins', sans-serif;
        }
        .brand-font {
          font-family: 'Cinzel Decorative', cursive;
          letter-spacing: 2px;
        }
        .glow-text {
          text-shadow: 0 0 25px rgba(181, 23, 158, 0.9);
        }
        .section-heading {
          color: #f4e6ff;
          text-shadow: 0 0 15px rgba(181, 23, 158, 0.7);
        }
        .movie-card {
          
           background-color: #120020 !important;
        }
        .movie-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(181, 23, 158, 0.5);
        }
        .movie-card:hover img {
          transform: scale(1.05);
        }
        .gradient-btn {
          background: linear-gradient(90deg, #6a11cb 0%, #b5179e 100%);
          border: none;
          color: white;
          transition: all 0.3s ease;
        }
        .gradient-btn:hover {
          box-shadow: 0 0 25px rgba(181, 23, 158, 0.8);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;

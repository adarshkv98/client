import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://server-eom8.onrender.com/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie)
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{
          backgroundColor: "#1b0a2a",
          color: "#fff",
          margin: "0",
          padding: "0",
        }}
      >
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      <Navbar />

      <div
        className="text-light"
        style={{
          backgroundColor: "#1b0a2a",
          minHeight: "100vh",
          margin: "0",
          padding: "40px 20px",
          overflowX: "hidden",
        }}
      >
        <div className="container-fluid">
          <div className="row align-items-center justify-content-center">
            {/* 🎞 Poster */}
            <div className="col-lg-5 mb-4 text-center">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg"
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "cover",
                  border: "3px solid rgba(255,255,255,0.3)",
                }}
              />
            </div>

            {/* 🎬 Details */}
            <div className="col-lg-6 text-start">
              <h1
                className="fw-bold mb-3 text-uppercase"
                style={{ letterSpacing: "1px" }}
              >
                {movie.title}
              </h1>

              <p className="text-secondary mb-1">
                <strong>Genre:</strong> {movie.genre?.join(", ")}
              </p>
              <p className="text-secondary mb-1">
                <strong>Language:</strong> {movie.language || "N/A"}
              </p>
              <p className="text-secondary mb-1">
                <strong>Duration:</strong> {movie.duration} mins
              </p>
              <p className="text-secondary mb-1">
                <strong>Release Date:</strong>{" "}
                {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
              <p className="text-warning mb-4">
                <strong>⭐ Rating:</strong> {movie.rating}/10
              </p>

              <p
                className="fs-5 lh-lg"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {movie.description}
              </p>

              {/* 👨‍🎤 CAST SECTION */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="mt-5">
                  <h4 className="fw-bold text-uppercase mb-3">Cast</h4>
                  <ul className="list-unstyled">
                    {movie.cast.map((member, index) => (
                      <li
                        key={index}
                        className="mb-2"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        🎭 <strong>{member.actorName}</strong> as{" "}
                        <span className="text-warning">{member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🎟️ Buttons */}
              <div className="mt-5 d-flex flex-wrap gap-3">
                <Link
                  to={`/theaters?movieId=${movie._id}`}
                  className="btn btn-lg px-4 fw-bold text-light gradient-btn"
                >
                  🎟️ Book Now
                </Link>

                <Link
                  to="/dashboard"
                  className="btn btn-lg px-4 fw-bold text-light gradient-btn"
                >
                  ← Back to Movies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <style>{`
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #1b0a2a !important;
            overflow-x: hidden;
          }
          .gradient-btn {
            background: linear-gradient(90deg, #6a11cb 0%, #b5179e 100%);
            border: none;
            box-shadow: 0 4px 15px rgba(181, 23, 158, 0.4);
            transition: all 0.3s ease;
          }
          .gradient-btn:hover {
            box-shadow: 0 4px 25px rgba(181, 23, 158, 0.8);
            transform: translateY(-2px);
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}

export default MovieDetailsPage;

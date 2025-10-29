import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../api/axiosConfig";

function TheaterPage() {
  const [theaters, setTheaters] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const movieId = params.get("movieId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const theaterRes = await axios.get("/theaters");
        const fetchedTheaters = theaterRes.data.theaters || theaterRes.data || [];

        if (movieId) {
          const movieRes = await axios.get(`/movies/${movieId}`);
          setMovie(movieRes.data);
        }

        setTheaters(fetchedTheaters);
      } catch (err) {
        console.error("❌ Error fetching theaters:", err);
        setError("Failed to load theaters");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading)
    return (
      <div className="text-center mt-5 text-light">Loading theaters...</div>
    );

  if (error)
    return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div
      style={{
        backgroundColor: "#120020",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: "40px 20px",
        overflowX: "hidden",
      }}
    >
      <h1 className="text-center mb-5 fw-bold text-light">
        🎭{" "}
        {movieId
          ? `Select Theater for: ${movie?.title || "Selected Movie"}`
          : "All Theaters"}
      </h1>

      <div className="row justify-content-center mx-0">
        {theaters.length === 0 ? (
          <p className="text-center text-secondary">No theaters available.</p>
        ) : (
          theaters.map((theater) => (
            <div
              key={theater._id}
              className="col-sm-10 col-md-6 col-lg-4 col-xl-3 mb-4 d-flex justify-content-center"
            >
              <div className="modern-card text-light p-4 w-100">
                <h4 className="fw-bold text-uppercase">{theater.name}</h4>
                <hr className="divider" />
                <p className="text-secondary mb-1">
                  <strong>City:</strong> {theater.location?.city}
                </p>
                <p className="text-secondary mb-1">
                  <strong>Address:</strong> {theater.location?.address}
                </p>
                <p className="text-secondary mb-3">
                  <strong>Screens:</strong> {theater.screens?.length || 0}
                </p>

                <Link
                  to={`/theaters/${theater._id}?movieId=${movieId || ""}`}
                  className="btn gradient-btn w-100 fw-bold py-2"
                >
                  🎟️ View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-5">
        <Link
          to="/dashboard"
          className="btn btn-lg px-4 fw-bold text-light gradient-btn"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <style>
        {`
        body {
          margin: 0 !important;
          background-color: #120020 !important;
        }

        .modern-card {
          background: linear-gradient(145deg, #1d0638, #250748);
          border: 1px solid #3a2b5e;
          border-radius: 20px;
          box-shadow: 0 0 20px rgba(120, 0, 200, 0.2);
          transition: all 0.3s ease;
          transform: translateY(0);
        }

        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 0 30px rgba(170, 0, 255, 0.4);
          border-color: #b5179e;
        }

        .divider {
          border: 0;
          height: 1px;
          background: linear-gradient(90deg, #6a11cb, #b5179e);
          margin: 10px 0 15px;
        }

        .gradient-btn {
          background: linear-gradient(90deg, #6a11cb 0%, #b5179e 100%);
          border: none;
          color: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(181, 23, 158, 0.4);
          transition: all 0.3s ease;
        }

        .gradient-btn:hover {
          box-shadow: 0 0 25px rgba(181, 23, 158, 0.8);
          transform: translateY(-2px);
        }
        `}
      </style>
    </div>
  );
}

export default TheaterPage;

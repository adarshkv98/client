import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosConfig";

function TheaterDetailsPage() {
  const { id } = useParams();
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const res = await axios.get(`https://server-eom8.onrender.com/api/theaters/${id}`);
        setTheater(res.data.theater);
      } catch (err) {
        console.error("Error fetching theater:", err);
        setError("Failed to load theater details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTheater();
  }, [id]);

  if (loading)
    return <p className="text-center mt-5 text-light">Loading...</p>;
  if (error)
    return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!theater)
    return <p className="text-center mt-5 text-secondary">No theater found.</p>;

  return (
    <div
      className="container py-5 text-light"
      style={{ backgroundColor: "#1b0a2a", minHeight: "100vh" }}
    >
      <h1 className="fw-bold mb-4">{theater.name}</h1>

      <p className="text-secondary mb-1">
        <strong>City:</strong> {theater.location.city}
      </p>
      <p className="text-secondary mb-1">
        <strong>Address:</strong> {theater.location.address}
      </p>
      {theater.contact?.phone && (
        <p className="text-secondary mb-1">
          <strong>Contact:</strong> {theater.contact.phone}
        </p>
      )}
      {theater.contact?.email && (
        <p className="text-secondary mb-3">
          <strong>Email:</strong> {theater.contact.email}
        </p>
      )}

      <h4 className="text-warning mt-4">🎬 Movies Currently Showing</h4>
      {theater.movies?.length > 0 ? (
        <ul>
          {theater.movies.map((movie) => (
            <li key={movie._id}>
              <Link
                to={`/movies/${movie._id}`}
                className="text-light text-decoration-underline"
              >
                {movie.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-secondary">No movies listed for this theater.</p>
      )}

      <h4 className="text-warning mt-4">🪑 Screens</h4>
      {theater.screens?.length > 0 ? (
        <ul>
          {theater.screens.map((screen, index) => (
            <li key={index}>
              Screen {screen.screenNumber} — {screen.totalSeats} seats
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-secondary">No screen data available.</p>
      )}

      <div className="mt-4">
        <Link to="/theaters" className="btn btn-outline-light me-3">
          ← Back to Theaters
        </Link>
        <Link to="/dashboard" className="btn btn-light text-dark">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default TheaterDetailsPage;

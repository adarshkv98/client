import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data from previous page
  const { movie, theater, date, time, selectedSeats, totalAmount } =
    location.state || {};

  // ✅ Safety Check: If no data (e.g., user refreshed the page), go back to Home
  useEffect(() => {
    if (!location.state) {
      navigate("/"); // Or '/dashboard'
    }
  }, [location.state, navigate]);

  if (!location.state) return null; // Prevent rendering empty page before redirect

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #150022, #2a0647)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Ticket Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#fff",
          color: "#000",
          width: "90%",
          maxWidth: "900px",
          minHeight: "400px",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          overflow: "hidden",
          position: "relative",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        {/* Left Section - Poster */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            // ✅ FIX: Changed 'poster' to 'posterUrl' to match Backend Model
            src={
              movie?.posterUrl ||
              movie?.poster ||
              "https://cdn-icons-png.flaticon.com/512/744/744922.png"
            }
            alt="Movie Poster"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right Section - Ticket Details */}
        <div
          style={{
            flex: 1.3,
            background:
              "repeating-linear-gradient(45deg, #fdfdfd, #fdfdfd 10px, #ffffff 10px, #ffffff 20px)",
            padding: "35px 40px",
            position: "relative",
          }}
        >
          {/* Dotted Perforation Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "10px",
              background:
                "radial-gradient(circle at left, transparent 5px, #fff 6px)", // Tweaked for better look
              borderLeft: "2px dashed #ddd",
            }}
          ></div>

          <h2
            style={{
              color: "#e50914",
              fontWeight: "bold",
              fontSize: "1.8rem",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            {movie?.title || "Movie Title"}
          </h2>

          <p style={{ marginBottom: "10px" }}>
            <strong>🏢 Theater:</strong> {theater?.name || "N/A"}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>📅 Date:</strong>{" "}
            {date ? new Date(date).toLocaleDateString() : "N/A"}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>🕒 Time:</strong> {time || "N/A"}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>💺 Seats:</strong>{" "}
            {selectedSeats?.length ? selectedSeats.join(", ") : "N/A"}
          </p>
          <p style={{ marginBottom: "15px" }}>
            <strong>💰 Amount Paid:</strong> ₹{totalAmount || "0"}
          </p>

          <hr style={{ borderTop: "1px dashed #ccc" }} />

          <div className="text-center">
            <h5 style={{ color: "#28a745", fontWeight: "bold" }}>
              ✅ Payment Successful
            </h5>
            <p style={{ color: "#666" }}>Your booking has been confirmed 🎉</p>
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-danger px-4 mt-2"
              onClick={() => navigate("/")} // Redirect to Home
            >
              🎬 Book Another Movie
            </button>
          </div>
        </div>
      </div>

      {/* Animations & Reset */}
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #150022, #2a0647);
            overflow-x: hidden;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ConfirmationPage;
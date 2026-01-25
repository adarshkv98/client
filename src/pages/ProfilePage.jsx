import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function ProfilePage() {
  const { user, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get("https://server-eom8.onrender.com/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [token]);

  if (!user) {
    return (
      <div className="text-center text-light mt-5">
        <h3>Please log in to view your profile</h3>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center py-5"
      style={{
        background: "linear-gradient(180deg, #120024 0%, #1b002e 100%)",
        color: "white",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          maxWidth: "900px",
          width: "90%",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* ---------- USER INFO ---------- */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-light">{user.name}'s Profile</h2>
          <p className="text-secondary mb-1">Email: {user.email}</p>
          <hr className="border-secondary" />
        </div>

        {/* ---------- MY BOOKINGS SECTION ---------- */}
        <div>
          <h4 className="text-light mb-3">🎟️ My Bookings</h4>

          {bookings.length > 0 ? (
            <div className="row g-4">
              {bookings.map((b) => (
                <div className="col-md-6" key={b._id}>
                  <div
                    className="card bg-dark text-light shadow-sm h-100"
                    style={{
                      borderRadius: "16px",
                      border: "1px solid #333",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        b.movie?.posterUrl ||
                        "https://cdn-icons-png.flaticon.com/512/744/744922.png"
                      }
                      alt={b.movie?.title || "Movie Poster"}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body">
                      <h5 className="card-title text-danger fw-bold">
                        {b.movie?.title || "Unknown Movie"}
                      </h5>
                      <p>
                        <strong>🏢 Theater:</strong> {b.theater?.name || "N/A"}
                      </p>
                      <p>
                        <strong>💺 Seats:</strong> {b.seats.join(", ")}
                      </p>
                      <p>
                        <strong>💰 Amount:</strong> ₹{b.totalPrice || 0}
                      </p>
                      <small className="text-muted">
                        Booked on {new Date(b.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/bookings/my");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

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
          maxWidth: "700px",
          width: "90%",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-light">{user.name}'s Profile</h2>
          <p className="text-secondary mb-1">Email: {user.email}</p>
          <hr className="border-secondary" />
        </div>

        <div>
          <h4 className="text-light mb-3">🎟️ My Bookings</h4>
          {bookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle text-center">
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Seats</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.movie?.title || "Unknown Movie"}</td>
                      <td>{b.seats.join(", ")}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

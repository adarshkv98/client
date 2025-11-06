import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

function TheaterPage() {
  const [theaters, setTheaters] = useState([]);
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const movieId = params.get("movieId");

  // 🎬 Generate next 5 days
  const getNextFiveDays = () => {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const formatted = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
      return { full: date.toISOString().split("T")[0], label: `${day} ${formatted}` };
    });
  };

  const dates = getNextFiveDays();

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
        setSelectedDate(dates[0].full);
      } catch (err) {
        console.error("❌ Error fetching theaters:", err);
        setError("Failed to load theaters");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleShowtimeClick = (theaterId, time) => {
  navigate(
    `/book?movieId=${movieId}&theaterId=${theaterId}&date=${selectedDate}&time=${encodeURIComponent(
      time
    )}`
  );
};


  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );

  if (error)
    return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div
      className="theater-page min-vh-100 text-light"
      style={{
        background: "linear-gradient(135deg, #1a0324, #230a41)",
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100vw",
      }}
    >
      {/* 🎬 Header */}
      <div className="text-center py-4 border-bottom border-secondary">
        <h2
          className="fw-bold text-white brand-font glow-text"
          style={{ fontFamily: "'Cinzel Decorative', cursive" }}
        >
          {movie?.title || "Select Movie"}
        </h2>

        {/* 📅 Date Selector */}
        <div className="d-flex justify-content-center mt-3 flex-wrap">
          {dates.map((d) => (
            <div
              key={d.full}
              onClick={() => setSelectedDate(d.full)}
              className={`mx-2 px-3 py-2 rounded-pill ${
                selectedDate === d.full
                  ? "bg-gradient text-white"
                  : "border border-light text-light"
              }`}
              style={{
                cursor: "pointer",
                background:
                  selectedDate === d.full
                    ? "linear-gradient(90deg, #6a11cb 0%, #b5179e 100%)"
                    : "transparent",
                transition: "all 0.3s ease",
              }}
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* 🎞 Language & Price Filter */}
      <div className="container-fluid mt-4 px-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <span className="fw-semibold text-warning">
              {movie?.language || "English"} • {movie?.format || "2D"}
            </span>
          </div>
          
        </div>
      </div>

      {/* 🏢 Theater List */}
      <div className="container-fluid mt-4 pb-5 px-4">
        {theaters.length === 0 ? (
          <p className="text-center text-light mt-5">No theaters available.</p>
        ) : (
          theaters.map((theater) => (
            <div
              key={theater._id}
              className="p-4 mb-4 rounded shadow-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-light mb-1">{theater.name}</h5>
                  <p className="text-secondary mb-1">
                    {theater.location?.city || "Unknown City"}
                  </p>
                  <small className="text-success">Cancellation Available</small>
                </div>
                <Link
                  to={`/theaters/${theater._id}?movieId=${movieId || ""}`}
                  className="text-decoration-none text-info fw-semibold"
                >
                  Info
                </Link>
              </div>

              {/* 🎫 Showtimes */}
              <div className="mt-3 d-flex flex-wrap">
                {["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM", "10:00 PM"].map(
                  (time, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleShowtimeClick(theater._id, time)}
                      className="btn mx-2 mb-2 fw-semibold text-light"
                      style={{
                        background:
                          "linear-gradient(90deg, #6a11cb 0%, #b5179e 100%)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 3px 10px rgba(181,23,158,0.5)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.boxShadow =
                          "0 3px 20px rgba(181,23,158,0.8)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.boxShadow =
                          "0 3px 10px rgba(181,23,158,0.5)")
                      }
                    >
                      {time}
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔙 Back Button */}
      <div className="text-center pb-5">
        <Link
          to="/dashboard"
          className="btn px-4 py-2 fw-bold text-light"
          style={{
            background: "linear-gradient(90deg, #b5179e 0%, #6a11cb 100%)",
            borderRadius: "30px",
            boxShadow: "0 3px 15px rgba(181,23,158,0.6)",
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* 🧾 Custom CSS */}
      <style>{`
        * {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: #1a0324;
        }
        .brand-font {
          font-family: 'Cinzel Decorative', cursive;
        }
        .glow-text {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
        }
        .theater-page {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .container-fluid {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
      `}</style>
    </div>
  );
}

export default TheaterPage;

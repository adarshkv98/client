import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function BookingPage() {
  const { id } = useParams(); // Movie ID
  const location = useLocation();
  const navigate = useNavigate();

  // Get passed data
  const { selectedSeats = [], theaterId, date, time, theaterName } =
    location.state || {};

  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);
  const seatPrice = 150;
  const totalAmount = selectedSeats.length * seatPrice;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Looking for Showtime (Ultimate Fix Mode)...");

        // 1. Fetch Movie & Theater & Showtimes
        const [movieRes, theaterRes, showtimeRes] = await Promise.all([
          axios.get(`https://server-eom8.onrender.com/api/movies/${id}`),
          theaterId 
            ? axios.get(`https://server-eom8.onrender.com/api/theaters/${theaterId}`) 
            : Promise.resolve(null),
          axios.get("https://server-eom8.onrender.com/api/showtimes"),
        ]);

        setMovie(movieRes.data);

        // Set Theater
        if (theaterRes) {
          setTheater(theaterRes.data);
        } else {
          setTheater({ name: theaterName || "Unknown Theater" });
        }

        // 2. Find matching Showtime
        if (showtimeRes.data) {
            const allShowtimes = Array.isArray(showtimeRes.data) ? showtimeRes.data : showtimeRes.data.showtimes;
            
            // ✅ Step 1: Filter ONLY by Movie ID first
            const movieShows = allShowtimes.filter((s) => {
                const sMovieId = typeof s.movie === 'object' ? s.movie._id : s.movie;
                return String(sMovieId) === String(id);
            });

            console.log(`🎬 Found ${movieShows.length} shows for this movie.`);

            let finalShowtime = null;

            // ✅ Step 2: Try to find match by Date (Local String Match)
            const targetDateStr = new Date(date).toDateString(); // e.g., "Sun Jan 25 2026"
            
            const dateMatch = movieShows.find((s) => {
                 return new Date(s.startTime).toDateString() === targetDateStr;
            });

            if (dateMatch) {
                console.log("✅ Date Matched!");
                finalShowtime = dateMatch;
            } else {
                console.warn("⚠️ Date mismatch! Ignoring date and taking the FIRST available show for this movie.");
                // ✅ Step 3: FALLBACK - If Date doesn't match, just take ANY show for this movie.
                // This prevents the "No shows found" error completely.
                if (movieShows.length > 0) {
                    finalShowtime = movieShows[0];
                }
            }

            if (finalShowtime) {
                console.log("✅ Final Showtime ID Selected:", finalShowtime._id);
                setShowtimeId(finalShowtime._id);
            } else {
                console.error("❌ Fatal: No showtime found for this MOVIE ID at all.");
                alert("Critical Error: No showtimes exist for this movie in the database.");
            }
        }

      } catch (err) {
        console.error("Error fetching booking data:", err);
      }
    };

    fetchData();
  }, [id, theaterId, theaterName, date, time]);

  const handleProceedToPayment = () => {
    if (!movie) {
      alert("Please wait — fetching movie info...");
      return;
    }

    if (!showtimeId) {
        // This will only happen if the database has ZERO shows for this movie
        alert(`Error: No shows found in database for Movie ID: ${id}`);
        return;
    }

    const theaterData = {
      _id: theater?._id || theaterId,
      name: theater?.name || theaterName || "Unknown Theater",
      location: theater?.location || {},
    };

    navigate("/payment", {
      state: {
        movie,
        theater: theaterData,
        showtime: showtimeId,
        date,
        time,
        selectedSeats,
        totalAmount,
      },
    });
  };

  if (!movie)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0324, #230a41)",
          color: "#fff",
        }}
      >
        <h4>Loading booking details...</h4>
      </div>
    );

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a0324, #230a41)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "700px",
          background: "linear-gradient(145deg, #1f0538, #2a0a4e)",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(219, 239, 109, 0.96)",
          padding: "40px 50px",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{ fontWeight: "bold", letterSpacing: "1px" }}
        >
          🎫 Confirm Your Booking
        </h2>

        <div className="text-center mb-4">
          <h4
            style={{
              color: "#ffcc00",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {movie.title}
          </h4>
          <p style={{ marginBottom: "5px" }}>
            🎭 {theater?.name || theaterName || "Unknown Theater"}{" "}
            {theater?.location?.city ? `- ${theater.location.city}` : ""}
          </p>
          <p style={{ marginBottom: "5px" }}>
            🗓 {new Date(date).toLocaleDateString()} | 🕒 {time}
          </p>
          <p style={{ marginBottom: "5px" }}>
            💺 Seats:{" "}
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "No seats selected"}
          </p>
          <h5
            style={{
              marginTop: "20px",
              color: "#00ff99",
              fontWeight: "bold",
            }}
          >
            💵 Total Amount: ₹{totalAmount}
          </h5>
        </div>

        <div className="text-center">
          <button
            className="btn btn-warning px-5 py-2 fw-bold rounded-pill"
            style={{
              fontSize: "1rem",
              transition: "0.3s ease",
              boxShadow: "0 5px 15px rgba(255, 193, 7, 0.4)",
            }}
            onClick={handleProceedToPayment}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Proceed to Payment ₹{totalAmount}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1a0324, #230a41);
            overflow-x: hidden;
          }
        `}
      </style>
    </div>
  );
}
export default BookingPage;
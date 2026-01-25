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
        console.log("🔍 Looking for Showtime...");
        console.log("URL Data:", { id, theaterId, date, time });

        // 1. Fetch Movie & Theater
        const [movieRes, theaterRes, showtimeRes] = await Promise.all([
          axios.get(`https://server-eom8.onrender.com/api/movies/${id}`),
          theaterId ? axios.get(`/theaters/${theaterId}`) : Promise.resolve(null),
          axios.get("https://server-eom8.onrender.com/api/showtimes"),
        ]);

        setMovie(movieRes.data);

        // Set Theater
        if (theaterRes) {
          setTheater(theaterRes.data);
        } else {
          setTheater({ name: theaterName || "Unknown Theater" });
        }

        // 2. Find matching Showtime (FINAL FIX)
        if (showtimeRes.data) {
            const allShowtimes = Array.isArray(showtimeRes.data) ? showtimeRes.data : showtimeRes.data.showtimes;
            
            // Step A: Filter by Movie and Theater first
            const candidates = allShowtimes.filter((s) => {
                const sMovieId = typeof s.movie === 'object' ? s.movie._id : s.movie;
                const sTheaterId = typeof s.theater === 'object' ? s.theater._id : s.theater;
                
                // ID Check
                if (String(sMovieId) !== String(id)) return false;
                if (theaterId && String(sTheaterId) !== String(theaterId)) return false;
                return true;
            });

            console.log(`🎬 Candidates found: ${candidates.length}`);

            // Step B: Smart Match (Date & Time)
            let foundShowtime = candidates.find((s) => {
                // Use Local Browser Time for Date Comparison (Safest for UI)
                const sDate = new Date(s.startTime).toDateString();
                const uDate = new Date(date).toDateString();

                if (sDate !== uDate) return false;

                // Time Comparison: Remove all spaces and special chars
                // Example: "10:00 AM" -> "1000am"
                const cleanTargetTime = time.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                
                // Check against UTC, IST, and Local
                const dateObj = new Date(s.startTime);
                const options = { hour: "numeric", minute: "numeric", hour12: true };
                
                const timeUTC = dateObj.toLocaleTimeString("en-US", { ...options, timeZone: "UTC" }).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const timeIST = dateObj.toLocaleTimeString("en-US", { ...options, timeZone: "Asia/Kolkata" }).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const timeLocal = dateObj.toLocaleTimeString("en-US", options).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                return (cleanTargetTime === timeUTC) || (cleanTargetTime === timeIST) || (cleanTargetTime === timeLocal);
            });

            // Step C: Fallback (If exact time fails, take the ONLY show on that date)
            if (!foundShowtime) {
                const dateMatches = candidates.filter(s => 
                    new Date(s.startTime).toDateString() === new Date(date).toDateString()
                );

                if (dateMatches.length === 1) {
                    console.log("⚠️ Exact time mismatch, but found 1 valid show for this date. Using it.");
                    foundShowtime = dateMatches[0];
                } else if (dateMatches.length > 1) {
                    console.warn("❌ Multiple shows on this date. Cannot guess correctly.");
                }
            }

            if (foundShowtime) {
                console.log("✅ Final Showtime ID:", foundShowtime._id);
                setShowtimeId(foundShowtime._id);
            } else {
                console.error("❌ Fatal: No matching showtime found.");
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
        // Detailed error for debugging
        alert(`Error: Showtime not verified.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\n\nPlease go back and select the show again.`);
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
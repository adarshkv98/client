import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const movieId = params.get("movieId");
  const theaterId = params.get("theaterId");
  const date = params.get("date");
  const time = decodeURIComponent(params.get("time"));

  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]); // Stores ["A1", "A2"]
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showtimeId, setShowtimeId] = useState(null); // Store found ID
  const ticketPrice = 150;

  useEffect(() => {
    // Style settings
    document.body.style.backgroundColor = "#0f0026";
    
    const fetchData = async () => {
      try {
        console.log("🔍 Initializing Seat Selection...");

        // 1. Fetch Movie & Theater Info
        const [movieRes, theaterRes, showtimeRes] = await Promise.all([
           axios.get(`https://server-eom8.onrender.com/api/movies/${movieId}`),
           axios.get(`https://server-eom8.onrender.com/api/theaters/${theaterId}`),
           axios.get("https://server-eom8.onrender.com/api/showtimes")
        ]);

        setMovie(movieRes.data);
        
        // Handle Theater Data Structure
        const tData = theaterRes.data.theater || theaterRes.data.data || theaterRes.data || {};
        setTheater(tData);

        // 2. FIND SHOWTIME ID (Robust Logic)
        if (showtimeRes.data) {
            const allShowtimes = Array.isArray(showtimeRes.data) ? showtimeRes.data : showtimeRes.data.showtimes;
            
            // Filter by Movie ID
            const movieShows = allShowtimes.filter(s => {
                const sMovieId = typeof s.movie === 'object' ? s.movie._id : s.movie;
                return String(sMovieId) === String(movieId);
            });

            // Try matching Date
            const targetDateStr = new Date(date).toDateString();
            let foundShow = movieShows.find(s => new Date(s.startTime).toDateString() === targetDateStr);

            // Fallback: If date mismatch, pick first show (Fixes "No Show" error)
            if (!foundShow && movieShows.length > 0) {
                console.warn("⚠️ Date mismatch. Using fallback show.");
                foundShow = movieShows[0];
            }

            if (foundShow) {
                console.log("✅ Found Showtime ID:", foundShow._id);
                setShowtimeId(foundShow._id);

                // 3. FETCH BOOKED SEATS USING SHOWTIME ID
                // Note: Ensure you added the backend route '/seats/:id'
                const seatRes = await axios.get(`https://server-eom8.onrender.com/api/bookings/seats/${foundShow._id}`);
                setBookedSeats(seatRes.data || []);
                console.log("🔒 Booked Seats:", seatRes.data);
            } else {
                alert("Error: No showtime found for this movie/theater.");
            }
        }

      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId, theaterId, date, time]);

  const seatSections = [
    { name: "Front Section", rows: ["A", "B", "C", "D", "E"] },
    { name: "Middle Section", rows: ["F", "G", "H", "I", "J"] },
    { name: "Back Section", rows: ["K", "L", "M"] },
  ];

  const toggleSeat = (seatId) => {
    // Prevent clicking if booked
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : prev.length >= 10
        ? (alert("Max 10 seats per booking"), prev)
        : [...prev, seatId]
    );
  };

  useEffect(() => {
    setTotalPrice(selectedSeats.length * ticketPrice);
  }, [selectedSeats]);

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    
    // Pass the 'showtimeId' we found here to the next page
    // This prevents the "Showtime not verified" error on the next screen
    navigate(`/booking/${movieId}`, {
      state: { 
          selectedSeats, 
          theaterId, 
          date, 
          time, 
          theaterName: theater?.name,
          showtime: showtimeId // ✅ Passing ID correctly
      },
    });
  };

  const seatStyle = (isSelected, isBooked) => ({
    width: "38px",
    height: "38px",
    // Color Logic: Booked=Red/Grey, Selected=Yellow, Available=Green
    backgroundColor: isBooked ? "#6c757d" : isSelected ? "#f0ad4e" : "#28a745",
    color: "#fff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: isBooked ? "not-allowed" : "pointer", // Disable cursor if booked
    fontSize: "11px",
    fontWeight: isSelected ? "600" : "400",
    transition: "0.2s ease-in-out",
    opacity: isBooked ? 0.6 : 1, // Make booked seats look faded
    pointerEvents: isBooked ? "none" : "auto" // Disable clicks
  });

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f0026, #2d0055, #0a0020)",
        minHeight: "100vh",
        width: "100%",
        color: "#e2d9ff",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      <div className="py-5 text-center">
        <h2 className="fw-bold text-white">
          🎬 {movie?.title || "Select Your Seats"}
        </h2>
        <p className="text-light mb-1">
          🎭 {theater?.name} {theater?.city ? `• ${theater.city}` : ""}
        </p>
        <p className="text-light">
          {formattedDate} • {time}
        </p>
      </div>

      <div className="mx-auto text-center mb-5" style={{ width: "60%", borderTop: "5px solid #9b59b6", borderRadius: "100% / 50%", height: "60px", position: "relative" }}>
        <span style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", color: "#d1b3ff", fontWeight: "bold" }}>
          SCREEN
        </span>
      </div>

      <div className="text-center">
        {seatSections.map((section) => (
          <div key={section.name} className="mb-5">
            <h5 className="text-info fw-semibold mb-3">{section.name}</h5>
            {section.rows.map((row) => (
              <div key={row} className="d-flex align-items-center justify-content-center mb-2">
                <span className="fw-bold text-light me-3" style={{ width: "20px" }}>{row}</span>
                <div className="d-flex gap-1">
                  {[...Array(10)].map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isBooked = bookedSeats.includes(seatId); // Check if booked
                    return (
                      <div
                        key={seatId}
                        style={seatStyle(isSelected, isBooked)}
                        onClick={() => toggleSeat(seatId)}
                      >
                        {seatId}
                      </div>
                    );
                  })}
                </div>
                <div style={{ width: "40px" }}></div>
                <div className="d-flex gap-1">
                  {[...Array(10)].map((_, i) => {
                    const seatId = `${row}${i + 11}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isBooked = bookedSeats.includes(seatId); // Check if booked
                    return (
                      <div
                        key={seatId}
                        style={seatStyle(isSelected, isBooked)}
                        onClick={() => toggleSeat(seatId)}
                      >
                        {seatId}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center pb-5">
        <div className="mb-3 d-flex justify-content-center gap-4">
            <div className="d-flex align-items-center gap-2"><div style={{width: 20, height: 20, background: '#28a745', borderRadius: 4}}></div> Available</div>
            <div className="d-flex align-items-center gap-2"><div style={{width: 20, height: 20, background: '#f0ad4e', borderRadius: 4}}></div> Selected</div>
            <div className="d-flex align-items-center gap-2"><div style={{width: 20, height: 20, background: '#6c757d', borderRadius: 4}}></div> Booked</div>
        </div>
        <h5 className="text-light mb-3">
          Total Price: <span className="text-warning">₹{totalPrice}</span>
        </h5>
        <button
          className="btn btn-lg btn-warning px-5 fw-bold"
          disabled={selectedSeats.length === 0}
          onClick={handleConfirmBooking}
        >
          Confirm Booking ({selectedSeats.length} Selected)
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
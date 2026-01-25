import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig"; // Ensure this matches your setup
import "bootstrap/dist/css/bootstrap.min.css";

function BookingPage() {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedSeats = [], theaterId, date, time, theaterName } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);
  const totalAmount = selectedSeats.length * 150; // Assuming 150 per seat

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Finding Showtime...");

        const [movieRes, theaterRes, showtimeRes] = await Promise.all([
          axios.get(`/movies/${id}`),
          theaterId ? axios.get(`/theaters/${theaterId}`) : Promise.resolve(null),
          axios.get("/showtimes"), // Fetch ALL showtimes
        ]);

        setMovie(movieRes.data);
        if (theaterRes) setTheater(theaterRes.data);
        else setTheater({ name: theaterName || "Unknown Theater" });

        if (showtimeRes.data) {
            const allShowtimes = showtimeRes.data.showtimes || showtimeRes.data;
            
            // 1. Filter by Movie ID
            const movieShows = allShowtimes.filter(s => {
                const sMovieId = typeof s.movie === 'object' ? s.movie._id : s.movie;
                return String(sMovieId) === String(id);
            });

            if (movieShows.length === 0) {
                alert("CRITICAL: No shows found for this movie in Database. Please Add Shows in Admin Panel.");
                return;
            }

            // 2. Try to match Date & Time
            // We strip spaces and ignore case to match "10:00 AM" with "10:00am"
            const targetTime = time.replace(/\s/g, '').toLowerCase(); 
            const targetDate = new Date(date).toDateString();

            let foundShow = movieShows.find(s => {
                const sDate = new Date(s.startTime).toDateString();
                const sTime = new Date(s.startTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}).replace(/\s/g, '').toLowerCase();
                return sDate === targetDate && (sTime === targetTime);
            });

            // 3. FALLBACK: If exact match fails, just take the first show for this movie
            if (!foundShow) {
                console.warn("⚠️ Exact time mismatch. Auto-selecting first available show.");
                foundShow = movieShows[0];
            }

            console.log("✅ Selected Showtime ID:", foundShow._id);
            setShowtimeId(foundShow._id);
        }

      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, [id, theaterId, date, time]);

  const handleProceed = () => {
    if (!showtimeId) return alert("Error: Show ID not found. Cannot proceed.");
    
    navigate("/payment", {
      state: { movie, theater: theater || {name: theaterName}, showtime: showtimeId, date, time, selectedSeats, totalAmount }
    });
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container mt-5 text-white">
      <h2>Confirm Booking: {movie.title}</h2>
      <p>Seats: {selectedSeats.join(", ")}</p>
      <p>Amount: ₹{totalAmount}</p>
      <button onClick={handleProceed} className="btn btn-warning">Pay Now</button>
    </div>
  );
}

export default BookingPage;
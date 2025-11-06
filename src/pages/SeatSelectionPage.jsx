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
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const ticketPrice = 150;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#0f0026";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    const fetchData = async () => {
      try {
        if (movieId) {
          const movieRes = await axios.get(`/movies/${movieId}`);
          setMovie(movieRes.data);
        }

        if (theaterId) {
          const theaterRes = await axios.get(`/theaters/${theaterId}`);
          const tData =
            theaterRes.data.theater ||
            theaterRes.data.data ||
            theaterRes.data ||
            null;
          setTheater(tData);
        }

        // ✅ Fetch booked seats
        const bookedRes = await axios.get(
          `/bookings/booked?movieId=${movieId}&theaterId=${theaterId}&date=${date}&time=${encodeURIComponent(time)}`
        );
        setBookedSeats(bookedRes.data.bookedSeats || []);
      } catch (err) {
        console.error("❌ Error fetching details:", err);
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
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : prev.length >= 10
        ? (alert("❌ Max 10 seats per booking"), prev)
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

    navigate(`/booking/${movieId}`, {
      state: { selectedSeats, theaterId, date, time, theaterName: theater.name },
    });
  };

  const seatStyle = (isSelected, isBooked = false) => ({
    width: "38px",
    height: "38px",
    backgroundColor: isBooked
      ? "#d9534f"
      : isSelected
      ? "#f0ad4e"
      : "#28a745",
    color: "#fff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: isBooked ? "not-allowed" : "pointer",
    fontSize: "11px",
    fontWeight: isSelected ? "600" : "400",
    transition: "0.2s ease-in-out",
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
        overflowY: "auto",
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

      <div
        className="mx-auto text-center mb-5"
        style={{
          width: "60%",
          borderTop: "5px solid #9b59b6",
          borderRadius: "100% / 50%",
          height: "60px",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#d1b3ff",
            fontWeight: "bold",
          }}
        >
          SCREEN
        </span>
      </div>

      <div className="text-center">
        {seatSections.map((section) => (
          <div key={section.name} className="mb-5">
            <h5 className="text-info fw-semibold mb-3">{section.name}</h5>
            {section.rows.map((row) => (
              <div
                key={row}
                className="d-flex align-items-center justify-content-center mb-2"
              >
                <span
                  className="fw-bold text-light me-3"
                  style={{ width: "20px" }}
                >
                  {row}
                </span>
                <div className="d-flex gap-1">
                  {[...Array(10)].map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isBooked = bookedSeats.includes(seatId);
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
                    const isBooked = bookedSeats.includes(seatId);
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

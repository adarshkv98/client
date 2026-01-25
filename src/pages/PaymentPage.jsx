import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api/axiosConfig"; 

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const { movie, theater, date, time, selectedSeats, totalAmount, showtime } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiApp, setUpiApp] = useState("");
  const [upiId, setUpiId] = useState("");
  const [theaterName, setTheaterName] = useState("");

  useEffect(() => {
    setTheaterName(theater?.name || "Unknown Theater");
  }, [theater]);


  const saveBookingToDatabase = async (paymentId = "N/A") => {
    try {
      if (!showtime) {
        alert("Error: Showtime ID missing. Booking cannot be saved.");
        return;
      }

      const bookingData = {
        movie: movie._id,
        theater: theater._id,
        showtime: showtime, 
        seats: selectedSeats,
        totalPrice: totalAmount,
        paymentId: paymentId,
        date: date,
        time: time
      };

      console.log("Saving Booking:", bookingData);

      // Backend Call to save booking
      await api.post("/bookings", bookingData);

      alert("✅ Payment & Booking Successful!");
      
      navigate("/confirmation", {
        state: { movie, theater, date, time, selectedSeats, totalAmount, paymentId },
      });

    } catch (error) {
      console.error("Booking Save Error:", error);
      alert("⚠️ Payment deducted but Booking Failed! Contact support.");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentMethod) return alert("Please select a payment method");

    // --- RAZORPAY LOGIC ---
    if (paymentMethod === "Razorpay") {
      try {
        
        const { data } = await api.post("/payments/orders", {
          amount: totalAmount,
        });

        const options = {
          key: "YOUR_RAZORPAY_KEY_ID", 
          amount: data.amount,
          currency: data.currency,
          name: "CineAura",
          description: `Payment for ${movie?.title}`,
          order_id: data.id,
          handler: function (response) {
            // ✅ On Success, Save Booking
            saveBookingToDatabase(response.razorpay_payment_id);
          },
          prefill: {
            name: "User Name",
            email: "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#6f00ff",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } catch (error) {
        console.error("Razorpay Error:", error);
        alert("Payment Failed. Check console for details.");
      }
      return;
    }

    
    await saveBookingToDatabase(`DUMMY_${paymentMethod.toUpperCase()}_ID`);
  };

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
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1f0538, #2a0a4e)",
          padding: "50px 20px",
          borderRadius: "20px",
          width: "90%",
          maxWidth: "700px",
          boxShadow: "0 0 40px rgba(241, 242, 234, 0.96)",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
          💳 Payment Details
        </h2>

        <div className="mb-4 text-center">
          <h4 style={{ color: "#ffcc00" }}>{movie?.title}</h4>
          <p>📍 {theaterName}</p>
          <p>
            📅 {new Date(date).toLocaleDateString()} | 🕒 {time}
          </p>
          <p>🎟 Seats: {selectedSeats?.join(", ")}</p>
          <h5 className="mt-3" style={{ color: "#00ff99" }}>
            💰 Total Amount: ₹{totalAmount}
          </h5>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <form onSubmit={handlePayment}>
          <h5 className="text-center mb-3" style={{ color: "#ffcc00" }}>
            💰 Select a Payment Method
          </h5>

          <div className="d-flex flex-column align-items-start gap-2">
            {["Credit Card", "Debit Card", "UPI", "Razorpay"].map((method) => (
              <label key={method} style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                {method === "Credit Card"
                  ? "💳 Credit Card"
                  : method === "Debit Card"
                  ? "🏦 Debit Card"
                  : method === "UPI"
                  ? "🌀 UPI Apps"
                  : "⚡ Razorpay"}
              </label>
            ))}
          </div>

          {(paymentMethod === "Credit Card" ||
            paymentMethod === "Debit Card") && (
            <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#3b0077" }}>
              <h6>Enter Card Details</h6>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Card Number"
                maxLength={16}
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
              />
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="CVV"
                  maxLength={3}
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {paymentMethod === "UPI" && (
            <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#3b0077" }}>
              <h6>Select UPI App</h6>
              <div className="d-flex flex-column gap-2">
                {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                  <label key={app} style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="upiApp"
                      value={app}
                      onChange={(e) => setUpiApp(e.target.value)}
                      style={{ marginRight: "10px" }}
                    />
                    {app}
                  </label>
                ))}
              </div>
              <input
                type="text"
                className="form-control mt-3"
                placeholder="Enter your UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-warning px-4 py-2 rounded-pill fw-bold"
              style={{
                color: "#230a41",
                fontSize: "1rem",
                boxShadow: "0 5px 20px rgba(255, 193, 7, 0.5)",
                transition: "0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Confirm & Pay ₹{totalAmount}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: linear-gradient(135deg, #1a0324, #230a41);
          }
        `}
      </style>
    </div>
  );
};

export default PaymentPage;
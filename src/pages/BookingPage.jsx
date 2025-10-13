import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';

function BookingPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/movies/${id}`);
        setMovie(res.data);
        setSeats(Array.from({ length: 30 }, (_, i) => ({ number: i + 1, booked: false })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, [id]);

  const toggleSeat = (seat) => {
    if (seat.booked) return;
    if (selectedSeats.includes(seat.number)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.number));
    } else {
      setSelectedSeats([...selectedSeats, seat.number]);
    }
  };

  const handleBooking = async () => {
    try {
      await axios.post(`/bookings`, { movieId: movie._id, seats: selectedSeats });
      alert('Booking successful!');
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      alert('Booking failed!');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h2>Booking: {movie.title}</h2>
      <div className="mb-3">
        <h5>Select Seats</h5>
        <div className="d-flex flex-wrap gap-2">
          {seats.map(seat => (
            <button
              key={seat.number}
              className={`btn ${seat.booked ? 'btn-secondary' : selectedSeats.includes(seat.number) ? 'btn-success' : 'btn-outline-primary'}`}
              onClick={() => toggleSeat(seat)}
              disabled={seat.booked}
            >
              {seat.number}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleBooking} disabled={selectedSeats.length === 0}>
        Confirm Booking ({selectedSeats.length} seats)
      </button>
    </div>
  );
}

export default BookingPage;

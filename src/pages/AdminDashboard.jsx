import { useEffect, useState } from "react";
import  api from "../api/axiosConfig";

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [users, setUsers] = useState([]);

  const [movieForm, setMovieForm] = useState({ title: "", genre: "", duration: "", language: "", rating: "", releaseDate: "", posterUrl: "" });
  const [theaterForm, setTheaterForm] = useState({ name: "", city: "", address: "", screens: 1 });
  const [showtimeForm, setShowtimeForm] = useState({ movie: "", theater: "", startTime: "", endTime: "", seats: 0, pricePerSeat: 0 });

  // Fetch all data
  const fetchAll = async () => {
    try {
      const [moviesRes, bookingsRes, theatersRes, showtimesRes, usersRes] = await Promise.all([
        api.fetchMovies(), api.fetchBookings(), api.fetchTheaters(), api.fetchShowtimes(), api.fetchUsers()
      ]);
      setMovies(moviesRes.data.movies);
      setBookings(bookingsRes.data.bookings);
      setTheaters(theatersRes.data.theaters);
      setShowtimes(showtimesRes.data.showtimes);
      setUsers(usersRes.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Handlers
  const handleAddMovie = async () => { await api.addMovie({...movieForm, genre: movieForm.genre.split(",")}); fetchAll(); };
  const handleDeleteMovie = async (id) => { await api.deleteMovie(id); fetchAll(); };
  const handleDeleteBooking = async (id) => { await api.deleteBooking(id); fetchAll(); };
  const handleAddTheater = async () => { await api.addTheater({ name: theaterForm.name, location: { city: theaterForm.city, address: theaterForm.address }, screens: [{ screenNumber: 1, totalSeats: theaterForm.screens, seatLayout: [] }] }); fetchAll(); };
  const handleDeleteTheater = async (id) => { await api.deleteTheater(id); fetchAll(); };
  const handleAddShowtime = async () => { await api.addShowtime(showtimeForm); fetchAll(); };
  const handleDeleteShowtime = async (id) => { await api.deleteShowtime(id); fetchAll(); };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* Movies Section */}
      <section>
        <h2>Movies</h2>
        <input placeholder="Title" value={movieForm.title} onChange={e => setMovieForm({...movieForm, title: e.target.value})} />
        <input placeholder="Genre (comma separated)" value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} />
        <input placeholder="Duration" value={movieForm.duration} onChange={e => setMovieForm({...movieForm, duration: e.target.value})} />
        <input placeholder="Language" value={movieForm.language} onChange={e => setMovieForm({...movieForm, language: e.target.value})} />
        <input placeholder="Rating" value={movieForm.rating} onChange={e => setMovieForm({...movieForm, rating: e.target.value})} />
        <input type="date" value={movieForm.releaseDate} onChange={e => setMovieForm({...movieForm, releaseDate: e.target.value})} />
        <input placeholder="Poster URL" value={movieForm.posterUrl} onChange={e => setMovieForm({...movieForm, posterUrl: e.target.value})} />
        <button onClick={handleAddMovie}>Add Movie</button>

        <ul>
          {movies.map(m => <li key={m._id}>{m.title} <button onClick={() => handleDeleteMovie(m._id)}>Delete</button></li>)}
        </ul>
      </section>

      {/* Bookings Section */}
      <section>
        <h2>Bookings</h2>
        <ul>
          {bookings.map(b => <li key={b._id}>{b.user.name} - {b.movie.title} <button onClick={() => handleDeleteBooking(b._id)}>Delete</button></li>)}
        </ul>
      </section>

      {/* Theaters Section */}
      <section>
        <h2>Theaters</h2>
        <input placeholder="Name" value={theaterForm.name} onChange={e => setTheaterForm({...theaterForm, name: e.target.value})} />
        <input placeholder="City" value={theaterForm.city} onChange={e => setTheaterForm({...theaterForm, city: e.target.value})} />
        <input placeholder="Address" value={theaterForm.address} onChange={e => setTheaterForm({...theaterForm, address: e.target.value})} />
        <input placeholder="Screens" type="number" value={theaterForm.screens} onChange={e => setTheaterForm({...theaterForm, screens: e.target.value})} />
        <button onClick={handleAddTheater}>Add Theater</button>

        <ul>
          {theaters.map(t => <li key={t._id}>{t.name} - {t.location.city} <button onClick={() => handleDeleteTheater(t._id)}>Delete</button></li>)}
        </ul>
      </section>

      {/* Showtimes Section */}
      <section>
        <h2>Showtimes</h2>
        <select value={showtimeForm.movie} onChange={e => setShowtimeForm({...showtimeForm, movie: e.target.value})}>
          <option value="">Select Movie</option>
          {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
        </select>
        <select value={showtimeForm.theater} onChange={e => setShowtimeForm({...showtimeForm, theater: e.target.value})}>
          <option value="">Select Theater</option>
          {theaters.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <input type="datetime-local" value={showtimeForm.startTime} onChange={e => setShowtimeForm({...showtimeForm, startTime: e.target.value})} />
        <input type="datetime-local" value={showtimeForm.endTime} onChange={e => setShowtimeForm({...showtimeForm, endTime: e.target.value})} />
        <input type="number" placeholder="Seats" value={showtimeForm.seats} onChange={e => setShowtimeForm({...showtimeForm, seats: e.target.value})} />
        <input type="number" placeholder="Price/Seat" value={showtimeForm.pricePerSeat} onChange={e => setShowtimeForm({...showtimeForm, pricePerSeat: e.target.value})} />
        <button onClick={handleAddShowtime}>Add Showtime</button>

        <ul>
          {showtimes.map(s => <li key={s._id}>{s.movie.title} at {s.theater.name} <button onClick={() => handleDeleteShowtime(s._id)}>Delete</button></li>)}
        </ul>
      </section>

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <ul>
          {users.map(u => <li key={u._id}>{u.name} - {u.email} - {u.isAdmin ? "Admin" : "User"}</li>)}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;

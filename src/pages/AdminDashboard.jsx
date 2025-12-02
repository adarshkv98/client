// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

// Violet UI theme
const violetCard = {
  background: "linear-gradient(135deg, #240046 0%, #5a189a 100%)",
  border: "1px solid #9d4edd",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(75, 0, 130, 0.35)",
  color: "#fff",
  padding: "18px",
};

const headerAccent = { color: "#ff4dff" };

const AdminDashboard = () => {
  // data
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [users, setUsers] = useState([]);

  // UI
  const [activeTab, setActiveTab] = useState("movies");

  // Movie form
  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    language: "",
    rating: "",
    releaseDate: "",
    posterUrl: "",
    cast: [],
  });
  const [editMovieId, setEditMovieId] = useState(null);

  // Theater form
  const [theaterForm, setTheaterForm] = useState({
    name: "",
    city: "",
    address: "",
    screens: 1,
  });
  const [editTheaterId, setEditTheaterId] = useState(null);

  // Showtime form
  const [showtimeForm, setShowtimeForm] = useState({
    movie: "",
    theater: "",
    startTime: "",
    endTime: "",
    seats: 0,
    pricePerSeat: 0,
  });
  const [editShowtimeId, setEditShowtimeId] = useState(null);

  // fetch all data
  const fetchAll = async () => {
    try {
      const [m, b, t, s, u] = await Promise.all([
        api.get("/movies"),
        api.get("/bookings"),
        api.get("/theaters"),
        api.get("/showtimes"),
        api.get("/users"),
      ]);

      setMovies(Array.isArray(m.data) ? m.data : m.data.movies || m.data);
      setBookings(Array.isArray(b.data) ? b.data : b.data.bookings || b.data);
      setTheaters(Array.isArray(t.data) ? t.data : t.data.theaters || t.data);
      setShowtimes(Array.isArray(s.data) ? s.data : s.data.showtimes || s.data);
      setUsers(Array.isArray(u.data) ? u.data : u.data.users || u.data);
    } catch (err) {
      console.error("Error loading admin data:", err);
      alert("Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // =====================================================
  // ================== MOVIE CRUD ========================
  // =====================================================

  const handleMovieSubmit = async () => {
    try {
      const payload = {
        ...movieForm,
        genre:
          typeof movieForm.genre === "string"
            ? movieForm.genre.split(",").map((g) => g.trim())
            : movieForm.genre,
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
      };

      if (editMovieId) {
        await api.put(`/movies/${editMovieId}`, payload);
        setEditMovieId(null);
      } else {
        await api.post("/movies", payload);
      }

      setMovieForm({
        title: "",
        description: "",
        genre: "",
        duration: "",
        language: "",
        rating: "",
        releaseDate: "",
        posterUrl: "",
        cast: [],
      });

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error saving movie");
    }
  };

  const handleEditMovie = (m) => {
    setMovieForm({
      title: m.title,
      description: m.description,
      genre: Array.isArray(m.genre) ? m.genre.join(", ") : m.genre,
      duration: m.duration,
      language: m.language,
      rating: m.rating,
      releaseDate: m.releaseDate?.slice(0, 10),
      posterUrl: m.posterUrl,
      cast: m.cast,
    });

    setEditMovieId(m._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Delete movie?")) return;

    try {
      await api.delete(`/movies/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    }
  };

  // =====================================================
  // ================== THEATER CRUD =====================
  // =====================================================

  const handleTheaterSubmit = async () => {
    try {
      const payload = {
        name: theaterForm.name,
        location: {
          city: theaterForm.city,
          address: theaterForm.address,
        },
        screens: [
          {
            screenNumber: 1,
            totalSeats: Number(theaterForm.screens),
            seatLayout: [],
          },
        ],
      };

      if (editTheaterId) {
        await api.put(`/theaters/${editTheaterId}`, payload);
        setEditTheaterId(null);
      } else {
        await api.post("/theaters", payload);
      }

      setTheaterForm({ name: "", city: "", address: "", screens: 1 });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error saving theater");
    }
  };

  const handleEditTheater = (t) => {
    setTheaterForm({
      name: t.name,
      city: t.location?.city,
      address: t.location?.address,
      screens: t.screens?.[0]?.totalSeats,
    });

    setEditTheaterId(t._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTheater = async (id) => {
    if (!window.confirm("Delete theater?")) return;

    try {
      await api.delete(`/theaters/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete theater");
    }
  };

  // =====================================================
  // ================== SHOWTIME CRUD ====================
  // =====================================================

  const handleShowtimeSubmit = async () => {
    try {
      const payload = {
        ...showtimeForm,
        seats: Number(showtimeForm.seats),
        pricePerSeat: Number(showtimeForm.pricePerSeat),
      };

      if (editShowtimeId) {
        await api.put(`/showtimes/${editShowtimeId}`, payload);
        setEditShowtimeId(null);
      } else {
        await api.post("/showtimes", payload);
      }

      setShowtimeForm({
        movie: "",
        theater: "",
        startTime: "",
        endTime: "",
        seats: 0,
        pricePerSeat: 0,
      });

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error saving showtime");
    }
  };

  const handleEditShowtime = (s) => {
    setShowtimeForm({
      movie: s.movie?._id,
      theater: s.theater?._id,
      startTime: s.startTime?.slice(0, 16),
      endTime: s.endTime?.slice(0, 16),
      seats: s.seats,
      pricePerSeat: s.pricePerSeat,
    });

    setEditShowtimeId(s._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm("Delete showtime?")) return;

    try {
      await api.delete(`/showtimes/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete showtime");
    }
  };

  // Helper small stat
  const smallStat = (title, value) => (
    <div style={{ minWidth: 120 }}>
      <div style={{ color: "#ffb3ff", fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{title}</div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1b0a2a",
        color: "#fff",
        margin: 0,
        padding: 0,
      }}
    >
      {/* TOP BAR — LOGO REMOVED */}
      <div
        className="w-100 d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          background: "linear-gradient(90deg, #0f0c29, #302b63, #240046)",
          width: "100%",
          margin: 0,
        }}
      >
        <h3 style={{ fontWeight: 800, letterSpacing: 1 }}>CineAura — Admin</h3>

        <div className="d-flex align-items-center gap-3">
          {smallStat("Movies", movies.length)}
          {smallStat("Theaters", theaters.length)}
          {smallStat("Showtimes", showtimes.length)}
          {smallStat("Users", users.length)}
          {smallStat("Bookings", bookings.length)}
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="container-fluid mt-3 px-4">

        {/* Tabs */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {["movies", "theaters", "showtimes", "users", "bookings"].map((t) => (
            <button
              key={t}
              className="btn btn-sm"
              style={{
                background: activeTab === t ? "#7b2cbf" : "transparent",
                color: activeTab === t ? "white" : "#ffb3ff",
                border: "1px solid #c77dff",
                borderRadius: 10,
                padding: "8px 14px",
                fontWeight: 700,
              }}
              onClick={() => setActiveTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Movies Section */}
        {activeTab === "movies" && (
          <div style={violetCard} className="mb-4">
            <h4 style={headerAccent}>🎞 Manage Movies</h4>
            {/* FORM */}
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <input
                  style={{ color: "black" }}
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={movieForm.title}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, title: e.target.value })
                  }
                />
              </div>

              <div className="col-md-4">
                <input
                  style={{ color: "black" }}
                  type="text"
                  className="form-control"
                  placeholder="Genre (comma separated)"
                  value={movieForm.genre}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, genre: e.target.value })
                  }
                />
              </div>

              <div className="col-md-4">
                <input
                  style={{ color: "black" }}
                  type="text"
                  className="form-control"
                  placeholder="Language"
                  value={movieForm.language}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, language: e.target.value })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  style={{ color: "black" }}
                  type="number"
                  className="form-control"
                  placeholder="Duration"
                  value={movieForm.duration}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, duration: e.target.value })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  style={{ color: "black" }}
                  type="date"
                  className="form-control"
                  value={movieForm.releaseDate}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, releaseDate: e.target.value })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  style={{ color: "black" }}
                  type="number"
                  className="form-control"
                  placeholder="Rating"
                  value={movieForm.rating}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, rating: e.target.value })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  style={{ color: "black" }}
                  type="text"
                  className="form-control"
                  placeholder="Poster URL"
                  value={movieForm.posterUrl}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, posterUrl: e.target.value })
                  }
                />
              </div>

              <div className="col-12">
                <textarea
                  style={{ color: "black" }}
                  className="form-control"
                  rows="3"
                  placeholder="Description"
                  value={movieForm.description}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>

            {/* CAST SECTION */}
            <h6 className="mt-3" style={{ color: "#ffb3ff" }}>
              🎭 Cast
            </h6>

            {movieForm.cast.map((a, i) => (
              <div key={i} className="row g-2 mb-2">
                <div className="col-md-5">
                  <input
                    type="text"
                    style={{ color: "black" }}
                    className="form-control"
                    placeholder="Actor Name"
                    value={a.actorName}
                    onChange={(e) => {
                      const copy = [...movieForm.cast];
                      copy[i].actorName = e.target.value;
                      setMovieForm({ ...movieForm, cast: copy });
                    }}
                  />
                </div>

                <div className="col-md-5">
                  <input
                    type="text"
                    style={{ color: "black" }}
                    className="form-control"
                    placeholder="Role"
                    value={a.role}
                    onChange={(e) => {
                      const copy = [...movieForm.cast];
                      copy[i].role = e.target.value;
                      setMovieForm({ ...movieForm, cast: copy });
                    }}
                  />
                </div>

                <div className="col-md-2 text-center">
                  <button
                    className="btn w-100"
                    style={{ background: "#e5383b", color: "#fff" }}
                    onClick={() => {
                      setMovieForm({
                        ...movieForm,
                        cast: movieForm.cast.filter((_, idx) => idx !== i),
                      });
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}

            <button
              className="btn mt-2"
              style={{ border: "1px solid #c77dff", color: "#fff" }}
              onClick={() =>
                setMovieForm({
                  ...movieForm,
                  cast: [...movieForm.cast, { actorName: "", role: "" }],
                })
              }
            >
              ➕ Add Actor
            </button>

            {/* SUBMIT BUTTON */}
            <div className="mt-3">
              <button
                className="btn"
                style={{ background: "#7b2cbf", color: "#fff" }}
                onClick={handleMovieSubmit}
              >
                {editMovieId ? "Update Movie" : "Add Movie"}
              </button>
            </div>

            {/* MOVIE TABLE */}
            <div className="table-responsive mt-4">
              <table
                className="table table-bordered align-middle"
                style={{ background: "#3c096c", color: "#fff" }}
              >
                <thead style={{ background: "#5a189a" }}>
                  <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Duration</th>
                    <th>Language</th>
                    <th>Rating</th>
                    <th>Release</th>
                    <th>Description</th>
                    <th>Cast</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {movies.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <img
                          src={m.posterUrl}
                          width="60"
                          alt="poster"
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/80x120?text=No+Image")
                          }
                        />
                      </td>
                      <td>{m.title}</td>
                      <td>
                        {Array.isArray(m.genre)
                          ? m.genre.join(", ")
                          : m.genre}
                      </td>
                      <td>{m.duration}</td>
                      <td>{m.language}</td>
                      <td>{m.rating}</td>
                      <td>{m.releaseDate?.slice(0, 10)}</td>
                      <td style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                        {m.description}
                      </td>
                      <td>
                        {m.cast?.map((c, i) => (
                          <div key={i}>
                            🎭 {c.actorName} — <small>{c.role}</small>
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm"
                            style={{ background: "#ffbe0b" }}
                            onClick={() => handleEditMovie(m)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: "#e5383b", color: "#fff" }}
                            onClick={() => handleDeleteMovie(m._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------- THEATERS ----------------------------- */}
        {activeTab === "theaters" && (
          <div style={violetCard} className="mb-4">
            <h4 style={headerAccent}>🏢 Manage Theaters</h4>

            <div className="row g-3 mt-3">
              {["name", "city", "address", "screens"].map((key) => (
                <div className="col-md-3" key={key}>
                  <input
                    style={{ color: "black" }}
                    className="form-control"
                    type={key === "screens" ? "number" : "text"}
                    placeholder={key}
                    value={theaterForm[key]}
                    onChange={(e) =>
                      setTheaterForm({ ...theaterForm, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <button
              className="btn mt-3"
              style={{ background: "#7b2cbf", color: "#fff" }}
              onClick={handleTheaterSubmit}
            >
              {editTheaterId ? "Update Theater" : "Add Theater"}
            </button>

            <div className="table-responsive mt-3">
              <table
                className="table table-bordered"
                style={{ background: "#3c096c", color: "#fff" }}
              >
                <thead style={{ background: "#5a189a" }}>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Screens</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {theaters.map((t) => (
                    <tr key={t._id}>
                      <td>{t.name}</td>
                      <td>{t.location?.city}</td>
                      <td>{t.location?.address}</td>
                      <td>{t.screens?.length}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm"
                            style={{ background: "#ffbe0b" }}
                            onClick={() => handleEditTheater(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: "#e5383b", color: "#fff" }}
                            onClick={() => handleDeleteTheater(t._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------- SHOWTIMES ----------------------------- */}
        {activeTab === "showtimes" && (
          <div style={violetCard} className="mb-4">
            <h4 style={headerAccent}>⏰ Manage Showtimes</h4>

            <div className="row g-3 mt-3">
              <div className="col-md-3">
                <select
                  className="form-control"
                  style={{ color: "black" }}
                  value={showtimeForm.movie}
                  onChange={(e) =>
                    setShowtimeForm({ ...showtimeForm, movie: e.target.value })
                  }
                >
                  <option value="">Select Movie</option>
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-control"
                  style={{ color: "black" }}
                  value={showtimeForm.theater}
                  onChange={(e) =>
                    setShowtimeForm({
                      ...showtimeForm,
                      theater: e.target.value,
                    })
                  }
                >
                  <option value="">Select Theater</option>
                  {theaters.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  style={{ color: "black" }}
                  value={showtimeForm.startTime}
                  onChange={(e) =>
                    setShowtimeForm({
                      ...showtimeForm,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  style={{ color: "black" }}
                  value={showtimeForm.endTime}
                  onChange={(e) =>
                    setShowtimeForm({
                      ...showtimeForm,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  style={{ color: "black" }}
                  placeholder="Seats"
                  value={showtimeForm.seats}
                  onChange={(e) =>
                    setShowtimeForm({
                      ...showtimeForm,
                      seats: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  style={{ color: "black" }}
                  placeholder="Price per seat"
                  value={showtimeForm.pricePerSeat}
                  onChange={(e) =>
                    setShowtimeForm({
                      ...showtimeForm,
                      pricePerSeat: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              className="btn mt-3"
              style={{ background: "#7b2cbf", color: "#fff" }}
              onClick={handleShowtimeSubmit}
            >
              {editShowtimeId ? "Update Showtime" : "Add Showtime"}
            </button>

            <div className="table-responsive mt-4">
              <table
                className="table table-bordered"
                style={{ background: "#3c096c", color: "#fff" }}
              >
                <thead style={{ background: "#5a189a" }}>
                  <tr>
                    <th>Movie</th>
                    <th>Theater</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {showtimes.map((s) => (
                    <tr key={s._id}>
                      <td>{s.movie?.title}</td>
                      <td>{s.theater?.name}</td>
                      <td>{new Date(s.startTime).toLocaleString()}</td>
                      <td>{new Date(s.endTime).toLocaleString()}</td>
                      <td>{s.seats}</td>
                      <td>₹{s.pricePerSeat}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm"
                            style={{ background: "#ffbe0b" }}
                            onClick={() => handleEditShowtime(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: "#e5383b", color: "#fff" }}
                            onClick={() => handleDeleteShowtime(s._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------- USERS ----------------------------- */}
        {activeTab === "users" && (
          <div style={violetCard} className="mb-4">
            <h4 style={headerAccent}>👤 Users</h4>

            <div className="table-responsive mt-3">
              <table
                className="table table-bordered"
                style={{ background: "#3c096c", color: "#fff" }}
              >
                <thead style={{ background: "#5a189a" }}>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Admin</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.mobilenumber}</td>
                      <td style={{ color: u.isAdmin ? "#ffb3ff" : "#fff" }}>
                        {u.isAdmin ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------- BOOKINGS ----------------------------- */}
        {activeTab === "bookings" && (
          <div style={violetCard} className="mb-4">
            <h4 style={headerAccent}>🎟 Bookings</h4>

            <div className="table-responsive mt-3">
              <table
                className="table table-bordered"
                style={{ background: "#3c096c", color: "#fff" }}
              >
                <thead style={{ background: "#5a189a" }}>
                  <tr>
                    <th>User</th>
                    <th>Movie</th>
                    <th>Theater</th>
                    <th>Seats</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name || "—"}</td>
                      <td>{b.movie?.title || "—"}</td>
                      <td>{b.theater?.name || "—"}</td>
                      <td>{b.selectedSeats?.join(", ")}</td>
                      <td>₹{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

export default AdminDashboard;

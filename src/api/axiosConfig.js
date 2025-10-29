import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Movies
export const fetchMovies = () => api.get("/movies");
export const addMovie = (movie) => api.post("/movies", movie);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// Bookings
export const fetchBookings = () => api.get("/bookings");
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

// Theaters
export const fetchTheaters = () => api.get("/theaters");
export const addTheater = (theater) => api.post("/theaters", theater);
export const deleteTheater = (id) => api.delete(`/theaters/${id}`);

// Showtimes
export const fetchShowtimes = () => api.get("/showtimes");
export const addShowtime = (showtime) => api.post("/showtimes", showtime);
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`);

// Users
export const fetchUsers = () => api.get("/users");


export default api;
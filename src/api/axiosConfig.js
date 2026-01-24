import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/users"; 
// in production, VITE_API_URL = "https://server-eom8.onrender.com/api"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // cookies / auth support
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

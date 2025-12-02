import axios from "axios";

// Render production server
const api = axios.create({
  baseURL: "https://server-eom8.onrender.com/api",
  withCredentials: true,  // cookies / auth support
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

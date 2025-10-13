import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // change to your backend URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;

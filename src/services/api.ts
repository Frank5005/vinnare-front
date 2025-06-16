import axios from "axios";


/*
const baseURL = import.meta.env.PROD
  ? 'https://49b9-3-144-90-59.ngrok-free.app'
  : '/api';
  */


const api = axios.create({
  //baseURL: baseURL,
  baseURL: import.meta.env.VITE_API_URL,
  //baseURL: 'https://49b9-3-144-90-59.ngrok-free.app',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

export default api;

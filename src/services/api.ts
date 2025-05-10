import axios from 'axios';
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: 'https://4d82-3-147-45-32.ngrok-free.app',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token && !config.url?.includes("/api/user/verify") && !config.url?.includes("/api/user")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default api;


import axios from 'axios';
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: 'http://3.147.45.32:8080',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default api;

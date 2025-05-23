import axios from 'axios';

const api = axios.create({
  baseURL: 'https://5586-3-147-45-32.ngrok-free.app',
  //withCredentials: true,
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning']="true";
    return config;
  });

export default api;


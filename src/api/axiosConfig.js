import axios from "axios";

// 🔗 Define la URL base del backend.
// Usa la variable de entorno o localhost por defecto
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

// 🧩 Crea la instancia de Axios
const axiosInstance = axios.create({
  baseURL: "/api", // 👈 El proxy enviará al backend en localhost:9000
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

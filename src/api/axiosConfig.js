import axios from "axios";

// 🔗 Define la URL base del backend.
// Usa la variable de entorno o localhost por defecto
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:7777/api";

// 🧩 Crea la instancia de Axios
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Interceptor para agregar automáticamente el token si existe
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

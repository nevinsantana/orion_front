import axios from "axios";

function getBaseURL() {
  const { hostname, protocol } = window.location;

  // 🌐 Si está en producción (no localhost)
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${protocol}//${hostname}/api`;
  }

  // 💻 Si es entorno local
  // Usa variable de entorno si existe
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) {
    return envURL;
  }

  // ⚙️ Por defecto usa el puerto del backend (7777)
  return `${protocol}//${hostname}:9000/api`;
}

// 🧩 Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔐 Agrega el token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

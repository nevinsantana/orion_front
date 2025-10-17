import axios from "axios";

function getBaseURL() {
  const { hostname, protocol } = window.location;

  // 🌐 Si NO es localhost (por ejemplo, producción)
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${protocol}//${hostname}/api`;
  }

  // 💻 Si es entorno local:
  // Usa REACT_APP_API_URL si está definida (opcional)
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) {
    return envURL;
  }

  // 🔄 Si no hay variable de entorno, usa puerto 9000 por defecto
  // Puedes cambiar el 9000 por el puerto más usado en tu equipo
  return `${protocol}//${hostname}:9000/api`;
}

// 🧩 Crear la instancia de Axios
const axiosInstance = axios.create({
  baseURL: "/api", // 👈 El proxy enviará al backend en localhost:9000
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// 🔐 Agrega el token automáticamente si existe
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

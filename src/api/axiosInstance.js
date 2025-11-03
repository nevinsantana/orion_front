import axios from "axios";

function getBaseURL() {
  const { hostname, protocol } = window.location;

  // 🌐 Si estás en producción (por ejemplo, dominio real o despliegue en Vercel)
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${protocol}//${hostname}/api`;
  }

  // 💻 Si estás trabajando en local, usa el puerto del backend
  // Puedes cambiar el puerto si tu backend corre en otro (por ejemplo 7777)
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) return envURL;

  // Valor por defecto si no hay variable de entorno
  return `${protocol}//${hostname}:7777/api`;
}

// 🧩 Crear la instancia de Axios
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // para enviar cookies si las usas
});

// 🔐 Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

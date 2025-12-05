import axios from "axios";

// Obtiene la baseURL priorizando la variable de entorno
function getBaseURL() {
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) return envURL;

  const { hostname, protocol } = window.location;
  const DEV_PORTS = [7777, 9000];
  const fallbackPort = DEV_PORTS[0];

  // Fallback a localhost si no hay variable de entorno
  return `${protocol}//${hostname}:${fallbackPort}/api`;
}

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  // withCredentials: true,
  timeout: 10000, // opcional: timeout de 10s
});

// Interceptor para agregar token y Content-Type
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Si es FormData → NO tocar Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    return config;
  }

  // Si NO tiene body → eliminar Content-Type
  if (!config.data) {
    delete config.headers["Content-Type"];
    return config;
  }

  // Si tiene body JSON
  config.headers["Content-Type"] = "application/json";
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;

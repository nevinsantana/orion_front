import axios from "axios";

function getBaseURL() {
  const { hostname, protocol } = window.location;

  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${protocol}//${hostname}/api`;
  }

  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) return envURL;

  return `${protocol}//${hostname}:9000/api`;
}

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Interceptor — SOLO cuando es necesario
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Si es FormData → NO TOCAR CONTENT-TYPE
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    return config;
  }

  // Si NO tiene body, no pongas JSON
  if (!config.data) {
    delete config.headers["Content-Type"];
    return config;
  }

  // Si tiene body que NO es FormData
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default axiosInstance;

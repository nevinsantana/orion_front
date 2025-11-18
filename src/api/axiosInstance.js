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

// 🔐 INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // 🚫 JAMÁS tocar Content-Type si el body es FormData
  if (config.data instanceof FormData) {
    // ELIMINA cualquier Content-Type
    delete config.headers["Content-Type"];
    return config;
  }

  // Si NO es FormData → JSON normal
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default axiosInstance;

import axios from "axios";

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

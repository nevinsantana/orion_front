import axios from "axios";

export const axiosAI = axios.create({
  baseURL: "http://localhost:7777/api", // URL absoluta para AI
});

axiosAI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

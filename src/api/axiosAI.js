import axios from "axios";

const axiosAI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9000/api',

  // 👇 ESTA LÍNEA ES LA QUE CORRIGE TODO
  transformRequest: (data) => data,
});

axiosAI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // 👇 No permitir que Axios invente un Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default axiosAI;

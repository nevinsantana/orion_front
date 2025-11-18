import axios from "axios";

// Crear una instancia COMPLETAMENTE aislada
const axiosAI = axios.create({
  baseURL: "http://localhost:9000/api",
});

// IMPORTANTE:
// Usar interceptores propios de axiosAI, no de axios global
axiosAI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // NO agregar Content-Type
  // NO tocar nada más
  return config;
});

export default axiosAI;

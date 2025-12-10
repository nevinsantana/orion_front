import axios from "axios";

function getBaseURL() {
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) return envURL;

  const { hostname, protocol } = window.location;
  const DEV_PORTS = [7777, 9000];
  const fallbackPort = DEV_PORTS[0];

  return `${protocol}//${hostname}:${fallbackPort}/api`;
}

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Si es FormData → axios se encarga del Content-Type automáticamente
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.data) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

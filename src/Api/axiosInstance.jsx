import axios from "axios";
const BASE_URL = "https://dashboard.stars-gate.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
    }
    config.headers["Authorization"] = token ? `Bearer ${token}` : "";
    return Promise.resolve(config);
  },
  (error) => Promise.reject(error)
);

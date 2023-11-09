import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ADMIN_ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;

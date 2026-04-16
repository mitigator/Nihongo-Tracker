import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "", // same origin — Next.js serves /api routes directly
  withCredentials: true, // keep cookies working
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
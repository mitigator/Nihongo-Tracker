import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
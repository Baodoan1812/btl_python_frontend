import axios from "axios";

// Tạo axios instance (cấu hình baseURL chung)
const api = axios.create({
  baseURL: "http://localhost:8000/api", // sửa theo backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

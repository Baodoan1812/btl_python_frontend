import axios from "axios";

// Tạo axios instance (cấu hình baseURL chung)
const chat = axios.create({
  baseURL: "http://localhost:8000/chat", // sửa theo backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export default chat;

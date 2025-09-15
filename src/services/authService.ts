import api from "./api";

// API login
export const login = async (username, password) => {
  try {
    const res = await api.post("/login/", { username, password });
    return res.data; // trả về data từ server
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

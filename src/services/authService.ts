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
export const getUserDetail= async(userId)=>{  
  try {
    const res = await api.get(`/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // trả về data từ server
  } catch (err) {
    throw err.response?.data || { message: "Get user detail failed" };
  }
}
export const getUsers= async()=>{
  try {
    const res = await api.get(`/users/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // trả về data từ server
  } catch (err) {
    throw err.response?.data || { message: "Get users failed" };
  }
}
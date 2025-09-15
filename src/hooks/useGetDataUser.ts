import { useState, useEffect } from "react";
import api from "../services/api";

export default function useGetDataUser() {
  const [user, setUser] = useState(null);      // dữ liệu user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gọi API user, ví dụ endpoint: /user/me/
        const res = await api.get("/me/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // nếu dùng token
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data || { message: "Failed to fetch user" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // chạy 1 lần khi mount

  return { user, loading, error };
}

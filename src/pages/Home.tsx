import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGetDataUser from "../hooks/useGetDataUser";
import { getUsers } from "../services/authService";

export default function Home() {
    const { user } = useGetDataUser();
  const [users, setUsers] = useState<any[]>([]);
  const currentUserId = user?.id; // ví dụ: id của mình, bạn có thể lấy từ context hoặc props

  useEffect(() => {
    if (!currentUserId) return;
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // loại bỏ user hiện tại
        const dataExceptCurrent = data.filter((u) => u.id !== currentUserId);
        setUsers(dataExceptCurrent);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-700 mb-6">🏠 Home Page</h1>

      <div className="bg-white p-4 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <ul className="space-y-2 overflow-y-auto">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                to={`/users/${user.id}`}
                className="block px-3 py-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

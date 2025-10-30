import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGetDataUser from "../hooks/useGetDataUser";
import { getUsers } from "../services/authService";
import { createChatbotConversation } from "../services/conversation";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useGetDataUser();
  const [users, setUsers] = useState<any[]>([]);
  const currentUserId = user?.id;
  const [search, setSearch] = useState("");
  const Navigate = useNavigate();

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleChatbot = async () => {
    const res = await createChatbotConversation();
    Navigate(`/chat?conversationId=${res.conversation_id}&otherName=Chatbot`);
  };

  useEffect(() => {
    if (!currentUserId) return;
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        const dataExceptCurrent = data.filter((u) => u.id !== currentUserId);
        setUsers(dataExceptCurrent);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-green-100 to-green-200 py-10">
      <h1 className="text-4xl font-bold text-green-800 mb-8 animate-pulse">
        🏠 Welcome, {user?.username || "Guest"}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg w-96 md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
          <button
            onClick={handleChatbot}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Chatbot 🤖
          </button>
        </div>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <ul className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <Link
                to={`/users/${user.id}`}
                className="block px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 hover:shadow-md transition"
              >
                {user.username}
              </Link>
            </li>
          ))}

          {filteredUsers.length === 0 && (
            <li className="text-gray-500 italic text-center">No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
}

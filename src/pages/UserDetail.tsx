import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetail } from "../services/authService";
import { createConversation } from "../services/conversation";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const data = await getUserDetail(Number(userId));
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 italic">Loading user...</p>
      </div>
    );
  }

  const handleChat = async () => {
    const conv = await createConversation(user.id);
    navigate(`/chat?conversationId=${conv.id}&otherName=${user.username}`);
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 w-full max-w-sm text-center">
        {/* Avatar giả */}
        <div className="w-24 h-24 bg-blue-400 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>

        {/* Username */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.username}</h1>

        {/* Optional additional info */}
        {user.email && <p className="text-gray-500 mb-4">{user.email}</p>}

        {/* Chat button */}
        <button
          onClick={handleChat}
          className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-md transition"
        >
          💬 Chat
        </button>
      </div>
    </div>
  );
}

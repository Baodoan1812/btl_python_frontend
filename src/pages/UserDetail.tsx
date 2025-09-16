import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Giả sử bạn có API getUserById
import {getUserDetail} from "../services/authService";
import { createConversation } from "../services/conversation";
export default function UserDetail() {
  const { userId } = useParams(); // lấy userId từ URL (/users/:userId)
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
    return <p className="p-4">Loading user...</p>;
  }

  const handleChat = async () => {
    const conv=await createConversation(user.id);
    // điều hướng sang trang Chat kèm conversationId hoặc userId
    navigate(`/chat?conversationId=${conv.id}&otherName=${user.username}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
      <button
        onClick={handleChat}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Chat
      </button>
    </div>
  );
}

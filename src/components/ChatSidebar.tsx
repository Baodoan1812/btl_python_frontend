import { useNavigate } from "react-router-dom";

export default function ChatSidebar({ conversations }) {
  const navigate = useNavigate();
  const handleSelectConversation = (conv) => {
    navigate(
      `?conversationId=${conv.id}&otherName=${encodeURIComponent(conv.otherName)}`
    );
  };
  return (
    <div className="w-64 bg-gray-100 h-full border-r overflow-y-auto">
      <h2 className="p-4 text-xl font-bold border-b">Chats</h2>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            onClick={() => handleSelectConversation(conv)}
            className="p-4 cursor-pointer hover:bg-gray-200"
          >
            {conv.otherName}
          </li>
        ))}
      </ul>
    </div>
  );
}

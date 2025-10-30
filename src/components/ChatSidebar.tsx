import { useNavigate, useSearchParams } from "react-router-dom";

export default function ChatSidebar({ conversations }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeId = searchParams.get("conversationId");

  const handleSelectConversation = (conv) => {
    navigate(
      `?conversationId=${conv.id}&otherName=${encodeURIComponent(conv.otherName)}`
    );
  };

  return (
    <div className="w-72 bg-white h-full border-r shadow-md overflow-y-auto">
      <h2 className="p-4 text-2xl font-bold border-b text-gray-700 bg-gray-50">
        💬 Chats
      </h2>

      <ul className="divide-y divide-gray-200">
        {conversations.map((conv) => {
          const isActive = activeId === String(conv.id);
          return (
            <li
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={`
                flex items-center gap-3 p-4 cursor-pointer transition 
                rounded-r-lg
                hover:bg-blue-100 
                ${isActive ? "bg-blue-200 font-semibold shadow-inner" : ""}
              `}
            >
              {/* Optional avatar placeholder */}
              <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                {conv.otherName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{conv.otherName}</span>
            </li>
          );
        })}

        {conversations.length === 0 && (
          <li className="p-4 text-gray-500 italic text-center">
            No conversations
          </li>
        )}
      </ul>
    </div>
  );
}

import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, getMessageChatbot } from "../services/message";

export default function ChatWindow({ currentId }) {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const otherName = searchParams.get("otherName");

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // WebSocket connection
  useEffect(() => {
    if (!conversationId || !currentId) return;
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${conversationId}/`);
    setSocket(ws);

    ws.onopen = () => console.log("Connected to chat " + conversationId);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const msgFromServer = { sender: data.sender, content: data.message };
      setMessages((prev) => [
        ...prev,
        { ...msgFromServer, isMe: data.sender === currentId },
      ]);
    };

    return () => ws.close();
  }, [conversationId, currentId]);

  // Load initial messages
  useEffect(() => {
    if (!conversationId || !currentId) return;
    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversationId);
        const formatted = data.map((msg: any) => ({
          ...msg,
          isMe: msg.sender === currentId,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [conversationId, currentId]);

  useEffect(() => scrollToBottom(), [messages]);

  // Send message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    try {
      if (otherName === "Chatbot") {
        const userMsg = { sender: currentId, isMe: true, content: newMessage };
        setMessages((prev) => [...prev, userMsg]);
        const res = await getMessageChatbot(newMessage);
        const botMsg = { sender: "bot", content: res.reply };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const msgData = { sender: currentId, message: newMessage };
        if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(msgData));
        setMessages((prev) => [...prev, { ...msgData, isMe: true, content: newMessage }]);
      }
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 italic">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 border-l shadow-inner">
      {/* Header */}
      <div className="p-4 border-b bg-white font-bold text-gray-700 flex items-center gap-2 shadow-sm">
        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
          {otherName?.charAt(0).toUpperCase()}
        </div>
        <span className="text-lg">{otherName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                msg.isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

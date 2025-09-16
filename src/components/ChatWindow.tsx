import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../services/message";

export default function ChatWindow({ currentId }) {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const otherName = searchParams.get("otherName");

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // ref để scroll xuống cuối
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Kết nối WebSocket
  useEffect(() => {
    if (!conversationId || !currentId) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${conversationId}/`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to chat " + conversationId);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const msgFromServer = {
        sender: data.sender,
        content: data.message, // 👈 đổi content → message
      };
      console.log("Received:", data);

      setMessages((prev) => [
        ...prev,
        {
          ...msgFromServer,
          isMe: data.sender === currentId,
        },
      ]);
    };
    // ws.onclose = () => console.log("WebSocket closed");

    // return () => ws.close();
  }, [conversationId, currentId]);

  // Load lịch sử tin nhắn ban đầu
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
        console.log("Fetched messages:", formatted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, currentId]);

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gửi tin nhắn qua WebSocket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket) return;

    try {
      // Gọi API gửi tin nhắn
      const msg = await sendMessage(Number(conversationId), newMessage);
      // const formatted = {
      //   ...msg,
      //   isMe: msg.sender === currentId, // luôn check lại
      // };
      // setMessages((prev) => [...prev, formatted]);
      const msgData = {
        sender: currentId,
        message: newMessage, // 👈 đổi content → message
      };
      
      console.log("Sending:", msgData);
      
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msgData)); // 👈 stringify
      } else {
        console.warn("⚠️ WebSocket not ready:", socket.readyState);
      }
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }

  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="p-4 border-b font-bold">{otherName}</div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-2 ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.isMe
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

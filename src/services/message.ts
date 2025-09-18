import chat from "./chat"; // instance axios đã tạo

// 1. Lấy danh sách conversation
export const getMessages = async (conversationId) => {
  try {
    const res = await chat.get(`/messages?conversation_id=${conversationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // mảng conversation
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch conversations" };
  }
};
export const sendMessage = async (conversationId, content) => {
    try {
        const res = await chat.post('/messages/', {
            conversation: conversationId,
            content: content
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to send message" };
    }
}
export const getMessageChatbot = async (message) => {
    try {
        const res = await chat.post('/chatbot-reply/', {
            message: message
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to get chatbot message" };
    }

}

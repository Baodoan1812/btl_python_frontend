import chat from "./chat"; // instance axios đã tạo

// 1. Lấy danh sách conversation
export const getConversations = async () => {
  try {
    const res = await chat.get("/conversations/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // mảng conversation
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch conversations" };
  }
};

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

// 2. Tạo conversation mới
export const createConversation = async (otherId) => {
  try {
    const res= await chat.post(
      "/conversations/",
      { other_id: otherId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data; // conversation mới tạo
  } catch (error) {
    throw error.response?.data || { message: "Failed to create conversation" };
  }
}
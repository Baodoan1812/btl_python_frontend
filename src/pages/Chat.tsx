import { useEffect, useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { getConversations } from "../services/conversation";
import { getUserDetail } from "../services/authService";
import useGetDataUser from "../hooks/useGetDataUser";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const { user } = useGetDataUser();
  console.log("Current user:", user);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const data = await getConversations();

        const mapped = await Promise.all(
          data.map(async (conv) => {
            const isMeMyId = conv.my_id === user.id;
            let otherId, otherName;

            if (isMeMyId) {
              // mình là my_id -> other là other_id
              const res = await getUserDetail(conv.other_id);
              otherId = res.id;
              otherName = res.username;
            } else {
              // mình là other_id -> other là my_id
              const res = await getUserDetail(conv.my_id);
              otherId = res.id;
              otherName = res.username;
            }

            return {
              ...conv,
              otherId,
              otherName,
            };
          })
        );

        setConversations(mapped);
        console.log("Mapped conversations:", mapped);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [user]);

  return (
    <div className="flex h-screen">
      <ChatSidebar conversations={conversations} />
      <ChatWindow currentId= {user?.id}/>
    </div>
  );
}

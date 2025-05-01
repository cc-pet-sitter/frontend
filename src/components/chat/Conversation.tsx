import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AppUser, Inquiry, Message } from "../../types/userProfile";
import { useTranslation } from "react-i18next";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface ConversationProps {
  inquiry: Inquiry;
  otherUserInfo: AppUser
}

const Conversation: React.FC<ConversationProps> = ({ inquiry, otherUserInfo }) => {
  const { currentUser, userInfo } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const senderId = userInfo?.id;
  const receiverId = senderId === inquiry.owner_appuser_id ? inquiry.sitter_appuser_id : inquiry.owner_appuser_id;
  const otherUserFullName = `${otherUserInfo.firstname} ${otherUserInfo.lastname}`;

  const { t } = useTranslation();

  useEffect(() => {
    if (!userInfo) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, [userInfo, inquiry]);

  const fetchMessages = async () => {
    if (!currentUser) return;

    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${apiURL}/inquiry/${inquiry.id}/message`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const messagesData: Message[] = await response.json();
      setMessages(messagesData);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Do not send empty messages
    if (!currentUser || senderId === null || receiverId === null) {
      console.error("User is not authenticated or IDs are missing.");
      return;
    }

    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${apiURL}/inquiry/${inquiry.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          author_appuser_id: senderId,
          recipient_appuser_id: receiverId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const message: Message = await response.json();
      // Update messages state with the new message
      setMessages([...messages, message]);
      setNewMessage(""); // Clear the input field
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-lg">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => {
          const isCurrentUser = message.author_appuser_id === userInfo?.id;
          return (
            <div
              key={message.id}
              className={`mb-4 p-4 rounded-lg ${
                isCurrentUser
                  ? "bg-[#D87607]/40 text-white self-end"
                  : "bg-white text-black self-start"
              }`}
            >
              <div className="flex items-center mb-2">
                {!isCurrentUser && (
                  <div className="font-semibold text-gray-800">
                    {otherUserFullName || "Unknown User"}
                  </div>
                )}
                <div className="text-xs text-gray-500 ml-2">
                  {new Date(message.time_sent).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-300 flex">
        {inquiry.inquiry_status !== "rejected" ? (
          <>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents adding a new line
                  sendMessage();
                }
              }}
              placeholder={t("request_details_page.input-box")}
              className="text-sm flex-grow border border-gray-300 rounded-xl p-4 focus:ring-1 focus:ring-[#D87607] focus:border-[#D87607] resize-none"
              rows={3}
            />
            <div className="flex place-items-end">
              <button
                onClick={sendMessage}
                className="btn-secondary py-2 px-2 text-sm rounded-r ml-2"
                aria-label="Send message"
              >
                {t("request_details_page.send")}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            {t("request_details_page.chat-over")}
          </p>
        )}
      </div>
    </div>
  );
};

export default Conversation;

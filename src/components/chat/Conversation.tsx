import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Inquiry, Message } from "../../types/userProfile";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface ConversationProps {
    inquiry: Inquiry;
}

const Conversation: React.FC<ConversationProps> = ({ inquiry }) => {
    const { currentUser, userInfo } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    const [senderId, setSenderId] = useState<number | null>(null);
    const [receiverId, setReceiverId] = useState<number | null>(null);

    useEffect(() => {
        if (!userInfo) return;

        if(userInfo?.id === inquiry.owner_appuser_id) {
            setSenderId(inquiry.owner_appuser_id);
            setReceiverId(inquiry.sitter_appuser_id);
        } else if (userInfo.id === inquiry.sitter_appuser_id) {
            setSenderId(inquiry.sitter_appuser_id);
            setReceiverId(inquiry.owner_appuser_id);
        } else {
            console.error("Current user is not associated with this inquiry");
            return;
        }

        fetchMessages();
        const interval = setInterval(fetchMessages, 300000); // Fetch every 5 minutes
        return () => clearInterval(interval);
    }, [userInfo, inquiry]);

    useEffect(() => {
        if (receiverId !== null) {
          fetchOtherUserInfo(receiverId);
        }
      }, [receiverId]);

    const fetchOtherUserInfo = async (otherUserId: number | null) => {
        if (!otherUserId || !currentUser) return;
    
        try {
          const idToken = await currentUser.getIdToken();
          const response = await fetch(`${apiURL}/appuser/${otherUserId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }
    
        } catch (err) {
          if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.error("An unexpected error occurred:", err);
          }
        }
    };

    const fetchMessages = async () => {
        if (!currentUser) return;

        try {
            const idToken = await currentUser?.getIdToken();
            const response = await fetch(`${apiURL}/inquiry/${inquiry.id}/message`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
            });
            
            if (!response.ok) {
                   throw new Error('Failed to fetch messages');
            }
            
            const messagesData: Message[] = await response.json();
            
            // Fetch sender names if not included in messagesData
            const messagesWithSenderNames = await Promise.all(
                messagesData.map(async (message: Message) => {
                    if (message.sender_name) {
                        return message;
                    } else {
                        const userResponse = await fetch(`${apiURL}/appuser/${message.author_appuser_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${idToken}`,
                        },
                        });
            
                        const userData = await userResponse.json();
            
                        return {
                        ...message,
                        sender_name: `${userData.firstname} ${userData.lastname}`,
                        };
                    }
                })
            );

            setMessages(messagesWithSenderNames);
    
        } catch (err) {
            if (err instanceof Error) {
              console.error(err.message);
            } else {
              console.error('An unexpected error occurred:', err);
            }
          }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return; // Do not send empty messages
        if (!currentUser || senderId === null || receiverId === null) {
            console.error("User is not authenticated or IDs are missing.");
            return;
        }

        try {
            const idToken = await currentUser?.getIdToken();
            const response = await fetch(`${apiURL}/inquiry/${inquiry.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
              console.error('An unexpected error occurred:', err);
            }
          }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg">
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((message) => {
              const isCurrentUser = message.author_appuser_id === userInfo?.id;
              return (
                <div
                  key={message.id}
                  className={`mb-4 p-4 rounded-lg ${
                    isCurrentUser 
                        ? "bg-orange-300 text-white self-end" 
                        : "bg-white text-black self-start"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {!isCurrentUser && (
                      <div className="font-semibold text-gray-800">
                        {message.sender_name || "Unknown User"}
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
          <div className="p-4 border-t flex items-center">
            { inquiry.inquiry_status !== "rejected" ?
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
                  placeholder="Type your message here... (Shift+Enter for new line)"
                  className="flex-grow border rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={4}
                />
                <button
                  onClick={sendMessage}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-r ml-2"
                  aria-label="Send message"
                >
                  Send
                </button>
              </> : <p>Further messaging has been disabled.</p>
            }
          </div>
        </div>
    );
};
    
export default Conversation;
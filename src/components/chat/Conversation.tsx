import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Message } from "../../types/userProfile";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface ConversationProps {
    inquiry_id: number;
}

const Conversation: React.FC<ConversationProps> = ({ inquiry_id }) => {
    const { currentUser, userInfo } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 300000); // Fetch every 5 minutes
        return () => clearInterval(interval);
      }, []);

    const fetchMessages = async () => {
        try {
            const idToken = await currentUser?.getIdToken();
            const response = await fetch(`${apiURL}/inquiry/${inquiry_id}/message`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
            });
            
            if (!response.ok) {
                   throw new Error('Failed to fetch messages');
            }
            
            const messagesData = await response.json();
            
            // Fetch sender names if not included in messagesData
            const messagesWithSenderNames = await Promise.all(
                messagesData.map(async (message) => {
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
    
        } catch (err: any) {
            console.error(err.message);
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return; // Do not send empty messages
        try {
            const idToken = await currentUser?.getIdToken();
            const response = await fetch(`${apiURL}/inquiry/${inquiry_id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    content: newMessage.trim(),
                    author_appuser_id: userInfo?.id,
                    recipient_appuser_id: userInfo?.id,
                    // Include other fields if necessary, like receiver_id
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
    
            const message: Message = await response.json();
            // Update messages state with the new message
            setMessages([...messages, message]);
            setNewMessage(''); // Clear the input field
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg">
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="mb-4 p-4 bg-white shadow-orange rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <div className="font-semibold text-gray-800">
                    {message.sender_name || "Unknown User"}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    {new Date(message.time_sent).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex items-center">
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
          </div>
        </div>
      );
};

export default Conversation;
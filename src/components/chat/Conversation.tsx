import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Message } from "../../types/userProfile";
import { useParams } from "react-router-dom";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;


const Conversation: React.FC = () => {
    const { currentUser } = useAuth();
    const { requestId } = useParams<{ requestId: string }>();
    const [messages, setMessages] = useState<Message[]>([])

    const fetchMessages = async () => {
        try {
            const idToken = await currentUser?.getIdToken();
            
            // Fetch request details
            const requestResponse = await fetch(`${apiURL}/inquiry/${requestId}/message`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
            });
            
            if (!requestResponse.ok) {
                   throw new Error('Failed to fetch messages');
            }
            
            const messages: Message[] = await requestResponse.json();
            setMessages(messages);
            console.log(messages);
        } catch (err: any) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        fetchMessages();
    },[]);
 
        

    return (
        <>
        <p>Convesation component dummy</p>
        <p></p>
        </>
    )
}

export default Conversation;
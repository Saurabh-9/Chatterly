import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export interface Message {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  timestamp: Timestamp;
  isSticker?: boolean;
}

export const useChat = (user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          id: doc.id,
          text: data.text,
          sender: data.sender,
          senderName: data.senderName,
          timestamp: data.timestamp,
          isSticker: data.isSticker || false
        });
      });
      setMessages(newMessages.reverse()); // Reverse to show oldest first
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const sendMessage = async (text: string, isSticker = false) => {
    if (!user || !text.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: text.trim(),
        sender: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        timestamp: serverTimestamp(),
        isSticker
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
};
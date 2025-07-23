import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export interface TypingUser {
  uid: string;
  displayName: string;
  timestamp: any;
}

export const useTyping = (user: User | null) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Listen for typing users
    const typingRef = collection(db, 'typing');
    const q = query(typingRef, where('uid', '!=', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: TypingUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only show users who were typing in the last 3 seconds
        const now = Date.now();
        const typingTime = data.timestamp?.toMillis() || 0;
        if (now - typingTime < 3000) {
          users.push({
            uid: data.uid,
            displayName: data.displayName,
            timestamp: data.timestamp
          });
        }
      });
      setTypingUsers(users);
    });

    return unsubscribe;
  }, [user]);

  const startTyping = useCallback(async () => {
    if (!user || isTyping) return;
    
    setIsTyping(true);
    try {
      await setDoc(doc(db, 'typing', user.uid), {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error setting typing status:', error);
    }
  }, [user, isTyping]);

  const stopTyping = useCallback(async () => {
    if (!user || !isTyping) return;
    
    setIsTyping(false);
    try {
      await deleteDoc(doc(db, 'typing', user.uid));
    } catch (error) {
      console.error('Error removing typing status:', error);
    }
  }, [user, isTyping]);

  return {
    typingUsers,
    startTyping,
    stopTyping
  };
};
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export interface OnlineUser {
  uid: string;
  displayName: string;
  email: string;
  lastSeen: Timestamp;
  isOnline: boolean;
}

export const useOnlineUsers = (user: User | null) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Set user as online when they connect
    const setUserOnline = async () => {
      try {
        await setDoc(doc(db, 'onlineUsers', user.uid), {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          email: user.email,
          lastSeen: serverTimestamp(),
          isOnline: true
        });
      } catch (error) {
        console.error('Error setting user online:', error);
      }
    };

    // Set user as offline when they disconnect
    const setUserOffline = async () => {
      try {
        await setDoc(doc(db, 'onlineUsers', user.uid), {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          email: user.email,
          lastSeen: serverTimestamp(),
          isOnline: false
        });
      } catch (error) {
        console.error('Error setting user offline:', error);
      }
    };

    setUserOnline();

    // Listen for online users
    const onlineUsersRef = collection(db, 'onlineUsers');
    const q = query(onlineUsersRef, where('isOnline', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: OnlineUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          lastSeen: data.lastSeen,
          isOnline: data.isOnline
        });
      });
      setOnlineUsers(users);
      setLoading(false);
    });

    // Update user's last seen every 30 seconds
    const heartbeatInterval = setInterval(() => {
      setUserOnline();
    }, 30000);

    // Set user offline when they leave
    const handleBeforeUnload = () => {
      setUserOffline();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setUserOffline();
      unsubscribe();
    };
  }, [user]);

  return {
    onlineUsers: onlineUsers.filter(u => u.uid !== user?.uid), // Exclude current user
    loading,
    totalOnline: onlineUsers.length
  };
};
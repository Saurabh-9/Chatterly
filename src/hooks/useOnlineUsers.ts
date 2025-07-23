import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  query,
  where,
  Timestamp,
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

    const userRef = doc(db, 'onlineUsers', user.uid);

    const goOnline = async () => {
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          isOnline: true,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    };

    const goOffline = async () => {
      await setDoc(
        userRef,
        {
          isOnline: false,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    };

    goOnline();

    const q = query(collection(db, 'onlineUsers'), where('isOnline', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: OnlineUser[] = snapshot.docs.map((doc) => doc.data() as OnlineUser);
      setOnlineUsers(users.filter((u) => u.uid !== user.uid));
      setLoading(false);
    });

    // Update online status every 25 seconds
    const heartbeat = setInterval(goOnline, 25000);

    // Offline when window closes
    window.addEventListener('beforeunload', goOffline);

    return () => {
      unsubscribe();
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', goOffline);
      goOffline();
    };
  }, [user]);

  return { onlineUsers, loading };
};

'use client';

import { useSocket } from '@/shared/providers/socket-provider';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// ---------- context ----------
interface PresenceContextType {
  onlineUsers: Set<string>;
  isUserOnline: (userId: string) => boolean;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: new Set(),
  isUserOnline: () => false,
});

export function usePresence() {
  return useContext(PresenceContext);
}

// ---------- provider ----------
export function PresenceProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    const handleOnlineList = (users: { userId: string; name: string }[]) => {
      setOnlineUsers(new Set(users.map((u) => u.userId)));
    };

    const handleUserOnline = (data: { userId: string; name: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleUserOffline = (data: { userId: string; name: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.userId);
        return next;
      });
    };

    socket.on('users:online_list', handleOnlineList);
    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);

    return () => {
      socket.off('users:online_list', handleOnlineList);
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [socket]);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return (
    <PresenceContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </PresenceContext.Provider>
  );
}

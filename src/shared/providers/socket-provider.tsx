'use client';

import { disconnectSocket, getSocket } from '@/shared/lib/socket-client';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    if (!session?.user?.id) return;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      // Register user
      socket.emit('register', {
        userId: session.user.id,
        name: session.user.name || 'Unknown',
        avatar: session.user.image || null,
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [session?.user?.id, session?.user?.name, session?.user?.image, socket]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !session?.user?.id) return;

    const s = getSocket();
    if (!s) return;

    setSocket(s);
    s.connect();

    const onConnect = () => {
      setIsConnected(true);
      s.emit('register', {
        userId: session.user.id,
        name: session.user.name || 'Unknown',
        avatar: session.user.image || null,
      });
    };

    const onDisconnect = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, [mounted, session?.user?.id]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

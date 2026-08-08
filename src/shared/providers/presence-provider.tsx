'use client';

import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

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
  const { data: session } = useSession();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Import the singleton from use-chat-pusher
    let presencePusher: Pusher | null = null;

    function getPresencePusher(): Pusher {
      if (!presencePusher) {
        presencePusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
          authEndpoint: '/api/pusher/auth',
        });
      }
      return presencePusher;
    }

    // In useEffect:
    const pusher = getPresencePusher();

    // Subscribe to a global presence channel for online users
    const presenceChannel = pusher.subscribe('presence-online');

    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const userIds = new Set<string>();
      members.each((member: any) => {
        userIds.add(member.id);
      });
      setOnlineUsers(userIds);
    });

    presenceChannel.bind('pusher:member_added', (member: any) => {
      setOnlineUsers((prev) => new Set(prev).add(member.id));
    });

    presenceChannel.bind('pusher:member_removed', (member: any) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    });

    pusherRef.current = pusher;

    return () => {
      presenceChannel.unbind_all();
      pusher.unsubscribe('presence-online');
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [session?.user?.id]);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return (
    <PresenceContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </PresenceContext.Provider>
  );
}

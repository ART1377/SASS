'use client';

import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage, TypingUser } from '../types';

let pusherInstance: Pusher | null = null;

function getPusher(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });
    (window as any).__pusherInstance = pusherInstance;
  }
  return pusherInstance;
}

export function useChatPusher(roomId: string) {
  const { data: session } = useSession();
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [deletedMessageIds, setDeletedMessageIds] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const pusher = getPusher();

    pusher.connection.bind('connected', () => setIsConnected(true));
    pusher.connection.bind('disconnected', () => setIsConnected(false));

    const channel = pusher.subscribe(`presence-room-${roomId}`);

    channel.bind('message:new', (msg: ChatMessage) => {
      setLiveMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    });

    channel.bind('message:deleted', (data: { roomId: string; messageId: string }) => {
      if (data.roomId !== roomId) return;
      setDeletedMessageIds((prev) => {
        if (prev.has(data.messageId)) return prev;
        const next = new Set(prev);
        next.add(data.messageId);
        return next;
      });
    });

    channel.bind('message:updated', (updated: ChatMessage) => {
      setLiveMessages((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
    });

    channel.bind('client-typing:user_started', (data: TypingUser & { roomId: string }) => {
      if (data.roomId !== roomId) return;
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === data.userId)
          ? prev
          : [...prev, { userId: data.userId, userName: data.userName }]
      );
    });

    channel.bind('client-typing:user_stopped', (data: { userId: string; roomId: string }) => {
      if (data.roomId !== roomId) return;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setOnlineCount(members.count);
    });

    channel.bind('pusher:member_added', () => {
      setOnlineCount((prev) => prev + 1);
    });

    channel.bind('pusher:member_removed', () => {
      setOnlineCount((prev) => Math.max(0, prev - 1));
    });

    channelRef.current = channel;

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`presence-room-${roomId}`);
      setIsConnected(false);
    };
  }, [roomId, session?.user?.id]);

  const triggerClientEvent = useCallback(
    (event: string, data: any) => {
      channelRef.current?.trigger(`client-${event}`, { ...data, roomId });
    },
    [roomId]
  );

  return {
    liveMessages,
    deletedMessageIds,
    typingUsers,
    onlineCount,
    isConnected,
    triggerClientEvent,
  };
}

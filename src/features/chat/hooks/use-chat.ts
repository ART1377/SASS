'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutationWithToast } from '@/shared/hooks/use-mutation-with-toast';
import { queryKeys } from '@/shared/lib/query-keys';
import { useSocket } from '@/shared/providers/socket-provider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { chatApi } from '../api/chat-api';
import type { ChatMessage, ChatRoom, ReplyInfo, RoomUpdatedPayload } from '../types';
import { useChatAPI } from './use-chat-api';
import { useChatSocket } from './use-chat-socket';
import { useForwardMessage } from './use-forward-message';

function createClientId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function useChat(roomId: string) {
  const { user } = useAuth();
  const api = useChatAPI(roomId);
  const socket = useChatSocket(roomId);
  const { forwardMessage } = useForwardMessage();

  const [pending, setPending] = useState<Map<string, ChatMessage>>(new Map());
  const registeredRef = useRef(false);

  useEffect(() => {
    if (socket.isConnected && user?.id && !registeredRef.current) {
      socket.registerUser({
        id: user.id as string,
        name: user.name || '',
        image: user.image || null,
      });
      registeredRef.current = true;
    }
    if (!socket.isConnected) registeredRef.current = false;
  }, [socket.isConnected, user, socket]);

  // Remove pending messages when confirmed broadcast arrives
  useEffect(() => {
    if (socket.liveMessages.length === 0 || pending.size === 0) return;
    setPending((prev) => {
      let changed = false;
      const next = new Map(prev);
      for (const msg of socket.liveMessages) {
        if (msg.clientId && next.has(msg.clientId)) {
          next.delete(msg.clientId);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [socket.liveMessages, pending.size]);

  // Merge: API history + live socket messages + pending optimistic - deleted
  const messages = useMemo(() => {
    const historyIds = new Set(api.messages.map((m) => m.id));
    const live = socket.liveMessages.filter(
      (m) => !historyIds.has(m.id) && !socket.deletedMessageIds.has(m.id)
    );
    const merged = [...api.messages, ...live]
      .filter((m) => !socket.deletedMessageIds.has(m.id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return [...merged, ...pending.values()];
  }, [api.messages, socket.liveMessages, socket.deletedMessageIds, pending]);

  const othersTyping = useMemo(
    () => socket.typingUsers.filter((u) => u.userId !== user?.id),
    [socket.typingUsers, user?.id]
  );

  const sendMessage = async (content: string, replyTo?: ReplyInfo) => {
    const trimmed = content.trim();
    if (!trimmed || !user) return;

    const clientId = createClientId();
    const optimisticMessage: ChatMessage = {
      id: clientId,
      clientId,
      roomId,
      senderId: user.id as string,
      content: trimmed,
      replyToId: replyTo?.id ?? null,
      replyTo: replyTo ?? null,
      createdAt: new Date().toISOString(),
      sender: { id: user.id as string, name: user.name || '', avatar: user.image || null },
      status: 'sending',
    };

    setPending((prev) => new Map(prev).set(clientId, optimisticMessage));

    try {
      await socket.send({
        content: trimmed,
        sender: { id: user.id as string, name: user.name || '', image: user.image || null },
        replyTo,
        clientId,
      });
    } catch {
      setPending((prev) => {
        const next = new Map(prev);
        const failed = next.get(clientId);
        if (failed) next.set(clientId, { ...failed, status: 'failed' });
        return next;
      });
    }
  };

  const retryMessage = (clientId: string) => {
    const failed = pending.get(clientId);
    if (!failed || !user) return;
    setPending((prev) => new Map(prev).set(clientId, { ...failed, status: 'sending' }));
    socket
      .send({
        content: failed.content,
        sender: { id: user.id as string, name: user.name || '', image: user.image || null },
        replyTo: failed.replyTo ?? undefined,
        clientId,
      })
      .catch(() => {
        setPending((prev) => {
          const next = new Map(prev);
          const f = next.get(clientId);
          if (f) next.set(clientId, { ...f, status: 'failed' });
          return next;
        });
      });
  };

  // ── Single delete with toast (uses socket for real-time broadcast) ──
  const deleteMessageWithToast = useCallback(
    async (messageId: string) => {
      try {
        await socket.deleteMessage(messageId);
        toast.success('پیام حذف شد');
      } catch {
        // Fallback to REST if socket fails
        try {
          await api.deleteMessageAsync(messageId);
          toast.success('پیام حذف شد');
        } catch {
          toast.error('خطا در حذف پیام');
        }
      }
    },
    [socket, api]
  );

  // ── Update message with toast (uses socket for real-time broadcast) ──
  const updateMessageWithToast = useCallback(
    async (messageId: string, content: string) => {
      try {
        await socket.updateMessage(messageId, content);
        toast.success('پیام ویرایش شد');
      } catch {
        // Fallback to REST if socket fails
        try {
          await api.updateMessage(messageId, content);
          toast.success('پیام ویرایش شد');
        } catch {
          toast.error('خطا در ویرایش پیام');
        }
      }
    },
    [socket, api]
  );

  // ── Bulk delete with toast ──
  const bulkDeleteMessagesWithToast = useCallback(
    async (messageIds: string[]) => {
      try {
        await Promise.all(messageIds.map((id) => socket.deleteMessage(id)));
        toast.success(`${messageIds.length} پیام حذف شد`);
      } catch {
        // Fallback to REST
        try {
          await Promise.all(messageIds.map((id) => api.deleteMessageAsync(id)));
          toast.success(`${messageIds.length} پیام حذف شد`);
        } catch {
          toast.error('خطا در حذف پیام‌ها');
        }
      }
    },
    [socket, api]
  );

  // ── Forward messages with toast ──
  const forwardMessagesWithToast = useCallback(
    async (targetRoomId: string, messagesToForward: ChatMessage[]) => {
      try {
        for (const msg of messagesToForward) {
          await forwardMessage(targetRoomId, msg);
        }
        toast.success(`${messagesToForward.length} پیام ارسال شد`);
      } catch {
        toast.error('خطا در ارسال پیام‌ها');
      }
    },
    [forwardMessage]
  );

  // ── Copy message with toast ──
  const copyMessageWithToast = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('پیام کپی شد');
    } catch {
      toast.error('خطا در کپی پیام');
    }
  }, []);

  return {
    messages,
    isLoading: api.isLoading,
    isError: api.isError,
    sendMessage,
    retryMessage,
    isSending: false,
    typingUsers: othersTyping,
    startTyping: socket.startTyping,
    stopTyping: socket.stopTyping,
    currentUser: user,
    refetch: api.refetch,
    onlineCount: socket.onlineCount,
    deleteMessage: api.deleteMessage,
    deleteMessageAsync: api.deleteMessageAsync,
    deleteMessageWithToast,
    updateMessage: updateMessageWithToast,
    bulkDeleteMessagesWithToast,
    forwardMessagesWithToast,
    copyMessageWithToast,
    hasOlderMessages: api.hasOlderMessages,
    isLoadingOlder: api.isLoadingOlder,
    loadOlderMessages: api.loadOlderMessages,
  };
}

// ─── Chat Rooms Hook (with live updates) ────────
export function useChatRooms(projectId?: string, activeRoomId?: string) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const queryKey = queryKeys.chat.rooms(projectId || 'all');

  const query = useQuery({
    queryKey,
    queryFn: () => chatApi.getRooms(projectId),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const onRoomUpdated = ({ roomId, lastMessage, isSender }: RoomUpdatedPayload) => {
      queryClient.setQueryData<ChatRoom[]>(queryKey, (prev) => {
        if (!prev) return prev;
        const isActive = roomId === activeRoomId;
        return prev
          .map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  lastMessage,
                  updatedAt: lastMessage.createdAt,
                  unreadCount:
                    isSender || isActive ? (room.unreadCount ?? 0) : (room.unreadCount ?? 0) + 1,
                }
              : room
          )
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    };

    socket.on('room:updated', onRoomUpdated);
    return () => {
      socket.off('room:updated', onRoomUpdated);
    };
  }, [socket, isConnected, queryClient, queryKey, activeRoomId]);

  return query;
}

// ─── Create Chat Room Hook ──────────────────────
export function useCreateChatRoom() {
  return useMutationWithToast({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      chatApi.createRoom(projectId, name),
    queryKey: ['chat'],
    successMessage: 'چت روم با موفقیت ایجاد شد',
    errorMessage: 'خطا در ایجاد چت روم',
  });
}

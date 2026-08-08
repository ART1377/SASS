'use client';

import { apiClient } from '@/shared/config/axios';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ReadReceipt {
  userId: string;
  messageIds: string[];
  readAt: string;
}

export function useReadReceipts(roomId: string) {
  const [readReceipts, setReadReceipts] = useState<Map<string, Set<string>>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingReadsRef = useRef<Set<string>>(new Set());
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for read receipts from other users via Pusher
  useEffect(() => {
    const pusher = (window as any).__pusherInstance;
    if (!pusher) return;

    const channel = pusher.channel(`presence-room-${roomId}`);
    if (!channel) return;

    const handleReadReceipt = (data: ReadReceipt & { roomId: string }) => {
      if (data.roomId !== roomId) return;

      setReadReceipts((prev) => {
        const next = new Map(prev);
        for (const messageId of data.messageIds) {
          const readers = next.get(messageId) || new Set();
          readers.add(data.userId);
          next.set(messageId, readers);
        }
        return next;
      });
    };

    channel.bind('messages:read_receipt', handleReadReceipt);
    return () => {
      channel.unbind('messages:read_receipt', handleReadReceipt);
    };
  }, [roomId]);

  // Flush pending reads to server via REST API
  const flushPendingReads = useCallback(async () => {
    if (pendingReadsRef.current.size === 0) return;

    const messageIds = Array.from(pendingReadsRef.current);
    pendingReadsRef.current.clear();

    try {
      await apiClient.post(`/chat/rooms/${roomId}/read-receipts`, { messageIds });
    } catch (error) {
      console.error('Failed to send read receipts:', error);
    }
  }, [roomId]);

  // Mark messages as read (batched with debounce)
  const markAsRead = useCallback(
    (messageIds: string | string[]) => {
      const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

      for (const id of ids) {
        pendingReadsRef.current.add(id);
      }

      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }

      flushTimeoutRef.current = setTimeout(() => {
        flushPendingReads();
      }, 2000);
    },
    [flushPendingReads]
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
      flushPendingReads();
    };
  }, [flushPendingReads]);

  // Intersection Observer to auto-mark visible messages as read
  const registerMessageElement = useCallback(
    (messageId: string, element: HTMLElement | null) => {
      if (!element) return;
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const id = entry.target.getAttribute('data-message-id');
                if (id) markAsRead(id);
              }
            }
          },
          { threshold: 0.5 }
        );
      }
      element.setAttribute('data-message-id', messageId);
      observerRef.current.observe(element);
    },
    [markAsRead]
  );

  // Cleanup observer
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const getReadBy = useCallback(
    (messageId: string, excludeUserId?: string): string[] => {
      const readers = readReceipts.get(messageId);
      if (!readers) return [];
      return Array.from(readers).filter((id) => id !== excludeUserId);
    },
    [readReceipts]
  );

  const isReadByUser = useCallback(
    (messageId: string, userId: string): boolean => {
      return readReceipts.get(messageId)?.has(userId) ?? false;
    },
    [readReceipts]
  );

  // Add this after the existing useEffect for listening:
  useEffect(() => {
    const loadInitialReadReceipts = async () => {
      try {
        const response = await apiClient.get(`/chat/rooms/${roomId}/read-receipts`);
        const data = response.data as Record<string, string[]>;

        setReadReceipts((prev) => {
          const next = new Map(prev);
          for (const [messageId, userIds] of Object.entries(data)) {
            const readers = next.get(messageId) || new Set();
            userIds.forEach((uid) => readers.add(uid));
            next.set(messageId, readers);
          }
          return next;
        });
      } catch {
        // Silently fail — read receipts are non-critical
      }
    };

    loadInitialReadReceipts();
  }, [roomId]);

  return {
    getReadBy,
    isReadByUser,
    registerMessageElement,
    markAsRead,
  };
}

'use client';

import { useSocket } from '@/shared/providers/socket-provider';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ReadReceipt {
  userId: string;
  messageIds: string[];
  readAt: string;
}

export function useReadReceipts(roomId: string) {
  const { socket, isConnected } = useSocket();
  const [readReceipts, setReadReceipts] = useState<Map<string, Set<string>>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingReadsRef = useRef<Set<string>>(new Set());
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for read receipts from other users
  useEffect(() => {
    if (!socket) return;

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

    socket.on('messages:read_receipt', handleReadReceipt);
    return () => {
      socket.off('messages:read_receipt', handleReadReceipt);
    };
  }, [socket, roomId]);

  // Flush pending reads to server
  const flushPendingReads = useCallback(() => {
    if (pendingReadsRef.current.size === 0 || !socket || !isConnected) return;

    const messageIds = Array.from(pendingReadsRef.current);
    pendingReadsRef.current.clear();

    socket.emit('messages:read', { roomId, messageIds });
  }, [socket, isConnected, roomId]);

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
      }, 500);
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

  return {
    getReadBy,
    isReadByUser,
    registerMessageElement,
    markAsRead,
  };
}

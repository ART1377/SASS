'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage, SocketMessage } from '../types';

export function createClientId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Tracks optimistically-sent messages (sending/failed) keyed by clientId,
 * and drops each placeholder once the matching confirmed broadcast arrives
 * in `liveMessages`. Kept separate from useChat so the optimistic-UI
 * bookkeeping is independently readable/testable.
 */
export function usePendingMessages(liveMessages: SocketMessage[]) {
  const [pending, setPending] = useState<Map<string, ChatMessage>>(new Map());

  useEffect(() => {
    if (liveMessages.length === 0 || pending.size === 0) return;
    setPending((prev) => {
      let changed = false;
      const next = new Map(prev);
      for (const msg of liveMessages) {
        if (msg.clientId && next.has(msg.clientId)) {
          next.delete(msg.clientId);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [liveMessages, pending.size]);

  const add = (message: ChatMessage) => {
    setPending((prev) => new Map(prev).set(message.clientId!, message));
  };

  const markSending = (clientId: string) => {
    setPending((prev) => {
      const next = new Map(prev);
      const item = next.get(clientId);
      if (item) next.set(clientId, { ...item, status: 'sending' });
      return next;
    });
  };

  const markFailed = (clientId: string) => {
    setPending((prev) => {
      const next = new Map(prev);
      const item = next.get(clientId);
      if (item) next.set(clientId, { ...item, status: 'failed' });
      return next;
    });
  };

  const get = (clientId: string) => pending.get(clientId);

  return { pending, add, markSending, markFailed, get };
}

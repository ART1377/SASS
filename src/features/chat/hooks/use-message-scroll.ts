'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useMessageScroll(messagesLength: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isNearBottom = useRef(true);
  const prevLength = useRef(0);

  const setMessageRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current.set(id, el);
    else messageRefs.current.delete(id);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    isNearBottom.current = distanceFromBottom < 100;
    setShowScrollButton(distanceFromBottom > 200);
  }, []);

  const scrollToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedId(messageId);
    setTimeout(() => setHighlightedId(null), 2000);
    // کاربر رو از near bottom خارج کن
    isNearBottom.current = false;
  }, []);

  // Auto-scroll ONLY if user was already near bottom
  useEffect(() => {
    if (messagesLength > prevLength.current && isNearBottom.current) {
      scrollToBottom();
    }
    prevLength.current = messagesLength;
  }, [messagesLength, scrollToBottom]);

  return {
    containerRef,
    bottomRef,
    highlightedId,
    showScrollButton,
    setMessageRef,
    handleScroll,
    scrollToBottom,
    scrollToMessage,
  };
}

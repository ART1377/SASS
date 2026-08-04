'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HIGHLIGHT_DURATION_MS } from '../constants';

interface UseMessageScrollOptions {
  onReachTop?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  /** True when the newest message was sent by the current user — always scroll for these. */
  isOwnLastMessage?: boolean;
}

export function useMessageScroll(
  messagesLength: number,
  { onReachTop, hasMore, isLoadingMore, isOwnLastMessage }: UseMessageScrollOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isNearBottom = useRef(true);
  const prevLength = useRef(0);
  const prevScrollHeight = useRef(0);

  const setMessageRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current.set(id, el);
    else messageRefs.current.delete(id);
  }, []);

  const scrollToBottom = useCallback((instant = false) => {
    bottomRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    isNearBottom.current = distanceFromBottom < 100;
    setShowScrollButton(distanceFromBottom > 200);

    if (scrollTop < 80 && hasMore && !isLoadingMore) {
      prevScrollHeight.current = scrollHeight;
      onReachTop?.();
    }
  }, [hasMore, isLoadingMore, onReachTop]);

  const scrollToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedId(messageId);
    setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
    isNearBottom.current = false;
  }, []);

  // Auto-scroll when new messages arrive — either the user was already near
  // the bottom, or the newest message is one they just sent themselves.
  // useLayoutEffect + double rAF ensures we measure/scroll only after the
  // browser has actually committed and painted the new layout, avoiding
  // races with framer-motion mounting the new message node.
  useLayoutEffect(() => {
    const isFirstLoad = prevLength.current === 0 && messagesLength > 0;
    const shouldScroll =
      messagesLength > prevLength.current && (isNearBottom.current || isOwnLastMessage);

    if (shouldScroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(isFirstLoad);
          isNearBottom.current = true;
        });
      });
    }
    prevLength.current = messagesLength;
  }, [messagesLength, isOwnLastMessage, scrollToBottom]);

  // Preserve scroll position after older messages are prepended
  useEffect(() => {
    if (isLoadingMore || !prevScrollHeight.current) return;
    const container = containerRef.current;
    if (!container) return;
    const diff = container.scrollHeight - prevScrollHeight.current;
    if (diff > 0) container.scrollTop += diff;
    prevScrollHeight.current = 0;
  }, [isLoadingMore]);

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

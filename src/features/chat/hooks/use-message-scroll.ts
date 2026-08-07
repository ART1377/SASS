'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { HIGHLIGHT_DURATION_MS } from '../constants';

interface UseMessageScrollOptions {
  onReachTop?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
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
  const [readyForTopLoad, setReadyForTopLoad] = useState(false);

  const isNearBottom = useRef(true);
  const prevLength = useRef(0);
  const prevScrollHeight = useRef(0);
  const isFetchingRef = useRef(false);
  const justLoadedOlderRef = useRef(false);

  const setMessageRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current.set(id, el);
    else messageRefs.current.delete(id);
  }, []);

  // Smooth scroll to bottom (for button click)
  const scrollToBottom = useCallback((instant = false) => {
    const container = containerRef.current;
    if (!container) return;

    if (instant) {
      container.scrollTop = container.scrollHeight;
    } else {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    isNearBottom.current = distanceFromBottom < 100;
    setShowScrollButton(distanceFromBottom > 200);

    if (readyForTopLoad && scrollTop < 80 && hasMore && !isLoadingMore && !isFetchingRef.current) {
      isFetchingRef.current = true;
      prevScrollHeight.current = scrollHeight;
      onReachTop?.();
    }
  }, [readyForTopLoad, hasMore, isLoadingMore, onReachTop]);

  const scrollToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedId(messageId);
    setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
    isNearBottom.current = false;
  }, []);

  // Restore scroll position after older messages are prepended.
  useLayoutEffect(() => {
    if (isLoadingMore || !prevScrollHeight.current) return;
    const container = containerRef.current;
    if (!container) return;
    const diff = container.scrollHeight - prevScrollHeight.current;
    if (diff > 0) container.scrollTop += diff;
    prevScrollHeight.current = 0;
    isFetchingRef.current = false;
    justLoadedOlderRef.current = true;
  }, [isLoadingMore]);

  // First load: position synchronously at the bottom
  useLayoutEffect(() => {
    const isFirstLoad = prevLength.current === 0 && messagesLength > 0;
    const skipForOlderLoad = justLoadedOlderRef.current;
    justLoadedOlderRef.current = false;

    const shouldScroll =
      !skipForOlderLoad &&
      messagesLength > prevLength.current &&
      (isNearBottom.current || isOwnLastMessage);

    if (isFirstLoad) {
      const container = containerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
      isNearBottom.current = true;
      setReadyForTopLoad(true);
    } else if (shouldScroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(false); // Use instant for auto-scroll on new messages
          isNearBottom.current = true;
        });
      });
    }
    prevLength.current = messagesLength;
  }, [messagesLength, isOwnLastMessage, scrollToBottom]);

  // Backfill: if there isn't enough history to make the container scrollable
  useLayoutEffect(() => {
    if (!readyForTopLoad || isLoadingMore || !hasMore || isFetchingRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollHeight <= container.clientHeight) {
      isFetchingRef.current = true;
      prevScrollHeight.current = container.scrollHeight;
      onReachTop?.();
    }
  }, [readyForTopLoad, messagesLength, isLoadingMore, hasMore, onReachTop]);

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

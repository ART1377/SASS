'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
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

  // Gate ALL top-of-list loading (scroll-triggered and backfill) until the
  // very first "jump to bottom" positioning has happened.
  const [readyForTopLoad, setReadyForTopLoad] = useState(false);

  const isNearBottom = useRef(true);
  const prevLength = useRef(0);
  const prevScrollHeight = useRef(0);
  // Synchronous lock, separate from `isLoadingMore` (which is state and
  // therefore lags by at least one render). A burst of native scroll
  // events firing within the same tick — common with trackpad/momentum
  // scrolling — would otherwise all read the same stale `isLoadingMore:
  // false` closure and each call onReachTop before React ever re-renders.
  const isFetchingRef = useRef(false);
  // Consumed by the auto-scroll effect below to skip forced scrolling when
  // the length increase came from prepending older history rather than a
  // genuinely new message — see the comment there for why this matters.
  const justLoadedOlderRef = useRef(false);

  const setMessageRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current.set(id, el);
    else messageRefs.current.delete(id);
  }, []);

  const scrollToBottom = useCallback((instant = false) => {
    bottomRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
  }, []);

  // Single source of truth for "load older messages": a genuine scroll
  // event from the user, and nothing else. After a page loads, the
  // scroll-position-preserving effect below pushes scrollTop back out of
  // the `< 80` zone, so this can't re-fire on its own — the user has to
  // actually scroll up again for the next page. This intentionally
  // replaces the earlier IntersectionObserver-based version, which could
  // re-trigger asynchronously without any real user action.
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

  // Restore scroll position once older messages have actually been
  // prepended (fires only after isLoadingMore flips back to false, by
  // which point scrollHeight has genuinely grown).
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

  // First load: position synchronously at the bottom (no rAF — see notes
  // in earlier iterations of this hook for why that matters), then unlock
  // top-of-list loading. On every other render, scroll to bottom only for
  // genuinely new messages — NOT when this length increase came from
  // prepending older history in the same commit (see justLoadedOlderRef;
  // without this check, if the current user happens to be the sender of
  // the newest message in the room, `isOwnLastMessage` stays true forever
  // and would force a scroll-to-bottom on every older-page load).
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
          scrollToBottom();
          isNearBottom.current = true;
        });
      });
    }
    prevLength.current = messagesLength;
  }, [messagesLength, isOwnLastMessage, scrollToBottom]);

  // Backfill: the ONLY case where more than one page can load without an
  // explicit user scroll. If there isn't yet enough history to make the
  // container scrollable, there's no scroll event for handleScroll to
  // react to, so we load proactively. This stops the instant the
  // container becomes scrollable (normal `handleScroll` gating takes over)
  // or history is exhausted — it cannot chain through the whole history.
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

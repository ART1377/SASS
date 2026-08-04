'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { AnimatePresence } from 'framer-motion';
import { Loader2, MessageSquare } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useMessageScroll } from '../hooks/use-message-scroll';
import type { ChatMessage, MessageGroup, ReplyInfo, TypingUser } from '../types';
import { ChatMessageSkeleton } from './chat-message-skeleton';
import { DateSeparator, isDifferentDay } from './date-separator';
import { MessageGroupBubble } from './message-group';
import { ScrollButton } from './scroll-button';
import { TypingIndicator } from './typing-indicator';

interface Props {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading: boolean;
  typingUsers: TypingUser[];
  onReply: (message: ReplyInfo) => void;
  scrollToMessageId: string | null;
  onReplyClick?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onRetry?: (clientId: string) => void;
  hasOlderMessages?: boolean;
  isLoadingOlder?: boolean;
  onLoadOlder?: () => void;
  // ─── Forward / multi‑select props ──────────
  selectMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onLongPress?: (id: string) => void;
}

export function ChatMessages({
  messages,
  currentUserId,
  isLoading,
  typingUsers,
  onReply,
  scrollToMessageId,
  onReplyClick,
  onEdit,
  onDelete,
  onRetry,
  hasOlderMessages,
  isLoadingOlder,
  onLoadOlder,
  selectMode,
  selectedIds,
  onToggleSelect,
  onLongPress,
}: Props) {
  const isOwnLastMessage = messages[messages.length - 1]?.senderId === currentUserId;

  const {
    containerRef,
    bottomRef,
    highlightedId,
    showScrollButton,
    setMessageRef,
    handleScroll,
    scrollToBottom,
    scrollToMessage,
  } = useMessageScroll(messages.length, {
    onReachTop: onLoadOlder,
    hasMore: hasOlderMessages,
    isLoadingMore: isLoadingOlder,
    isOwnLastMessage,
  });

  useEffect(() => {
    if (scrollToMessageId) {
      scrollToMessage(scrollToMessageId);
    }
  }, [scrollToMessageId, scrollToMessage]);

  const messageGroups = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    for (const msg of messages) {
      const isOwn = msg.senderId === currentUserId;
      const lastInGroup = currentGroup?.messages[currentGroup.messages.length - 1];
      const sameDay = lastInGroup ? !isDifferentDay(msg.createdAt, lastInGroup.createdAt) : true;
      const withinGap = lastInGroup
        ? new Date(msg.createdAt).getTime() - new Date(lastInGroup.createdAt).getTime() <
          5 * 60 * 1000
        : true;

      if (!currentGroup || currentGroup.senderId !== msg.senderId || !sameDay || !withinGap) {
        currentGroup = { senderId: msg.senderId, sender: msg.sender, messages: [], isOwn };
        groups.push(currentGroup);
      }
      currentGroup.messages.push(msg);
    }
    return groups;
  }, [messages, currentUserId]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {[...Array(5)].map((_, i) => (
          <ChatMessageSkeleton key={i} isOwn={i % 2 === 1} />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="هنوز پیامی ارسال نشده"
        description="اولین پیام را ارسال کنید"
        className="h-full flex-1"
      />
    );
  }

  let lastRenderedDay: string | null = null;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 space-y-4 overflow-y-auto p-4"
    >
      {isLoadingOlder && (
        <div className="flex justify-center py-2">
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        </div>
      )}

      <AnimatePresence initial={false}>
        {messageGroups.map((group, groupIndex) => {
          const firstMsg = group.messages[0];
          const showSeparator =
            !lastRenderedDay || isDifferentDay(firstMsg.createdAt, lastRenderedDay);
          lastRenderedDay = firstMsg.createdAt;

          return (
            <div key={`${group.senderId}-${firstMsg.id}`}>
              {showSeparator && <DateSeparator date={firstMsg.createdAt} />}
              <MessageGroupBubble
                group={group}
                isFirst={groupIndex === 0}
                onReply={onReply}
                highlightedId={highlightedId}
                onSetRef={setMessageRef}
                onReplyClick={onReplyClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onRetry={onRetry}
                // ─── Forward props ────────────
                selectMode={selectMode}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onLongPress={onLongPress}
              />
            </div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
      </AnimatePresence>

      <ScrollButton visible={showScrollButton} onClick={scrollToBottom} />
      <div ref={bottomRef} />
    </div>
  );
}

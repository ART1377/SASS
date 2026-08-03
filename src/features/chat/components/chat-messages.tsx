'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useMessageScroll } from '../hooks/use-message-scroll';
import type { ChatMessage, MessageGroup, ReplyInfo, TypingUser } from '../types';
import { ChatMessageSkeleton } from './chat-message-skeleton';
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
}: Props) {
  const {
    containerRef,
    bottomRef,
    highlightedId,
    showScrollButton,
    setMessageRef,
    handleScroll,
    scrollToBottom,
    scrollToMessage,
  } = useMessageScroll(messages.length);

  // Scroll to specific message when requested
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
      if (
        !currentGroup ||
        currentGroup.senderId !== msg.senderId ||
        (currentGroup.messages.length > 0 &&
          new Date(msg.createdAt).getTime() -
            new Date(currentGroup.messages[currentGroup.messages.length - 1].createdAt).getTime() >
            5 * 60 * 1000)
      ) {
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

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 space-y-4 overflow-y-auto p-4"
    >
      <AnimatePresence initial={false}>
        {messageGroups.map((group, groupIndex) => (
          <MessageGroupBubble
            key={`${group.senderId}-${group.messages[0].id}`}
            group={group}
            isFirst={groupIndex === 0}
            onReply={onReply}
            highlightedId={highlightedId}
            onSetRef={setMessageRef}
            onReplyClick={onReplyClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
      </AnimatePresence>

      <ScrollButton visible={showScrollButton} onClick={scrollToBottom} />
      <div ref={bottomRef} />
    </div>
  );
}

'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn, formatDateTime, getInitials } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import type { ChatMessage, MessageGroup, TypingUser } from '../types';
import { ChatMessageSkeleton } from './chat-message-skeleton';

interface Props {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading: boolean;
  typingUsers: TypingUser[];
}

export function ChatMessages({ messages, currentUserId, isLoading, typingUsers }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Group messages by sender + time proximity
  const messageGroups = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    for (const msg of messages) {
      const isOwn = msg.senderId === currentUserId;

      if (
        !currentGroup ||
        currentGroup.senderId !== msg.senderId ||
        // New group if gap > 5 minutes
        (currentGroup.messages.length > 0 &&
          new Date(msg.createdAt).getTime() -
            new Date(currentGroup.messages[currentGroup.messages.length - 1].createdAt).getTime() >
            5 * 60 * 1000)
      ) {
        currentGroup = {
          senderId: msg.senderId,
          sender: msg.sender,
          messages: [],
          isOwn,
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push(msg);
    }

    return groups;
  }, [messages, currentUserId]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isOwn />
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isOwn />
        <ChatMessageSkeleton />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
          >
            <svg
              className="text-muted-foreground/40 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.div>
          <p className="text-foreground text-sm font-medium">هنوز پیامی ارسال نشده</p>
          <p className="text-muted-foreground mt-1 text-xs">
            اولین پیام را ارسال کنید و گفتگو را شروع کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      <AnimatePresence initial={false}>
        {messageGroups.map((group, groupIndex) => (
          <MessageGroupBubble
            key={`${group.senderId}-${group.messages[0].id}`}
            group={group}
            isFirst={groupIndex === 0}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

// ─── Message Group ─────────────────────────────
function MessageGroupBubble({ group, isFirst }: { group: MessageGroup; isFirst: boolean }) {
  return (
    <motion.div
      initial={isFirst ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-end gap-2', group.isOwn && 'flex-row-reverse')}
    >
      {/* Avatar - only show for others, at the bottom */}
      {!group.isOwn && (
        <Avatar className="ring-border h-7 w-7 shrink-0 ring-2">
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
            {getInitials(group.sender.name)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('max-w-[75%] space-y-1', group.isOwn && 'items-end')}>
        {/* Sender name for groups */}
        {!group.isOwn && (
          <p className="text-muted-foreground px-1 text-[10px] font-medium">{group.sender.name}</p>
        )}

        {/* Messages */}
        {group.messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, delay: i * 0.03 }}
            className={cn(
              'rounded-2xl px-3.5 py-2',
              group.isOwn
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted rounded-bl-md'
            )}
          >
            <p className="text-[13px] leading-relaxed">{msg.content}</p>
          </motion.div>
        ))}

        {/* Timestamp - only on last message */}
        <p className={cn('text-muted-foreground/50 px-1 text-[10px]', group.isOwn && 'text-right')}>
          {formatDateTime(group.messages[group.messages.length - 1].createdAt)}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ──────────────────────────
function TypingIndicator({ users }: { users: TypingUser[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
      <Avatar className="ring-border h-7 w-7 shrink-0 ring-2">
        <AvatarFallback className="bg-primary/10 text-[10px]">
          {getInitials(users[0]?.userName || '')}
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted flex gap-1 rounded-full px-3 py-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="bg-muted-foreground/40 h-1.5 w-1.5 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs">
        {users.map((u) => u.userName).join(', ')} در حال تایپ...
      </span>
    </motion.div>
  );
}

'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn, formatDateTime, getInitials } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ChatMessageSkeleton } from './chat-message-skeleton';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: { name: string };
}

interface Props {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  typingUsers: { userId: string; userName: string }[];
}

export function ChatMessages({ messages, currentUserId, isLoading, typingUsers }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isOwn />
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isOwn />
        <ChatMessageSkeleton />
      </div>
    );
  }

  const hasContent = messages.length > 0 || typingUsers.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">
          هنوز پیامی ارسال نشده. اولین پیام را بفرستید!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn('flex items-end gap-2', isOwn && 'flex-row-reverse')}
    >
      <Avatar className="ring-border h-7 w-7 shrink-0 ring-2">
        <AvatarFallback className="bg-muted text-[10px]">
          {getInitials(message.sender.name)}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-3.5 py-2',
          isOwn ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
        )}
      >
        <p className="text-[13px] leading-relaxed">{message.content}</p>
        <p className="mt-1 text-left text-[10px] opacity-50">{formatDateTime(message.createdAt)}</p>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ users }: { users: { userId: string; userName: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
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

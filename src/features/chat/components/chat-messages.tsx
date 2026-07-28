'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn, formatDateTime, getInitials } from '@/shared/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
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
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
      ))}

      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn('flex items-end gap-2', isOwn && 'flex-row-reverse')}>
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
    </div>
  );
}

function TypingIndicator({ users }: { users: { userId: string; userName: string }[] }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-3">
      <div className="bg-muted flex gap-1 rounded-full px-3 py-2">
        <span
          className="bg-muted-foreground/40 h-1.5 w-1.5 animate-bounce rounded-full"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="bg-muted-foreground/40 h-1.5 w-1.5 animate-bounce rounded-full"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="bg-muted-foreground/40 h-1.5 w-1.5 animate-bounce rounded-full"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-muted-foreground text-xs">
        {users.map((u) => u.userName).join(', ')} در حال تایپ...
      </span>
    </div>
  );
}

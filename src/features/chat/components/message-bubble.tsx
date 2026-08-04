'use client';

import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import type { ChatMessage, ReplyInfo } from '../types';
import { MessageActions } from './message-actions';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  isHighlighted: boolean;
  onReply: (message: ReplyInfo) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReplyClick?: (messageId: string) => void;
  onSetRef: (id: string, el: HTMLDivElement | null) => void;
}

export function MessageBubble({
  message,
  isOwn,
  isHighlighted,
  onReply,
  onEdit,
  onDelete,
  onReplyClick,
  onSetRef,
}: MessageBubbleProps) {
  return (
    <motion.div
      ref={(el) => onSetRef(message.id, el)}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'group/bubble relative w-fit max-w-[75%] rounded-2xl px-3.5 py-2 transition-colors duration-700',
        isOwn ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md',
        isHighlighted && 'bg-primary/20'
      )}
    >
      {/* Reply Preview */}
      {message.replyTo && (
        <button
          onClick={() => onReplyClick?.(message.replyTo!.id)}
          className={cn(
            'mb-1 block w-full cursor-pointer rounded-lg border-r-2 px-2 py-1 text-start text-xs transition-all hover:opacity-80 active:scale-[0.98]',
            isOwn
              ? 'bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground/70'
              : 'bg-background/50 border-primary/30 text-muted-foreground'
          )}
        >
          <p className="text-[11px] font-medium">{message.replyTo.sender.name}</p>
          <p className="truncate text-[11px]">{message.replyTo.content}</p>
        </button>
      )}

      <p className="text-[13px] leading-relaxed">{message.content}</p>

      {/* Action buttons */}
      <MessageActions
        isOwn={isOwn}
        message={message}
        onReply={onReply}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </motion.div>
  );
}

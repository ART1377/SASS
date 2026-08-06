'use client';

import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { Forward } from 'lucide-react';
import type { ChatMessage, ReplyInfo } from '../types';
import { MessageFooter } from './message-footer';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  isHighlighted: boolean;
  onReply: (message: ReplyInfo) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReplyClick?: (messageId: string) => void;
  onSetRef: (id: string, el: HTMLDivElement | null) => void;
  onRetry?: (clientId: string) => void;
  selectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onLongPress?: (id: string) => void;
  onCopy?: (content: string) => void;
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
  onRetry,
  selectMode,
  isSelected,
  onToggleSelect,
  onLongPress,
  onCopy,
}: MessageBubbleProps) {
  const isPending = message.status === 'sending' || message.status === 'failed';

  const timeString = new Date(message.createdAt).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('w-full', isHighlighted && 'bg-primary/20 rounded-2xl')}>
      <motion.div
        ref={(el) => onSetRef(message.id, el)}
        layout
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: message.status === 'sending' ? 0.6 : 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={() => {
          if (selectMode) onToggleSelect?.(message.id);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (!selectMode) onLongPress?.(message.id);
        }}
        className={cn(
          'group/bubble relative w-fit max-w-[75%] rounded-2xl px-3.5 py-2 transition-colors duration-700',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted mr-auto rounded-bl-md',
          isHighlighted && 'bg-primary/80'
        )}
      >
        {selectMode && (
          <div
            className={cn(
              'absolute top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/30 bg-background',
              isOwn ? '-left-6' : '-right-6'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.(message.id);
            }}
          >
            {isSelected && (
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}

        {message.forwardedFromName && (
          <p
            className={cn(
              'mb-1 flex items-center gap-1 text-[11px]',
              isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground'
            )}
          >
            <Forward className="h-3 w-3" />
            از {message.forwardedFromName}
          </p>
        )}

        {message.replyTo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReplyClick?.(message.replyTo!.id);
            }}
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

        <span
          className={cn(
            'shrink-0 text-[10px] select-none',
            isOwn ? 'text-primary-foreground/50' : 'text-muted-foreground/50'
          )}
        >
          {timeString}
        </span>

        <MessageFooter
          message={message}
          isOwn={isOwn}
          isPending={isPending}
          selectMode={selectMode}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onRetry={onRetry}
          onCopy={onCopy}
        />
      </motion.div>
    </div>
  );
}

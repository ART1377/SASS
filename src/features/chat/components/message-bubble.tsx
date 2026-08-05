'use client';

import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
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
  onRetry?: (clientId: string) => void;
  // ─── Forward props ──────────────────────────
  selectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onLongPress?: (id: string) => void;
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
}: MessageBubbleProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const isPending = message.status === 'sending' || message.status === 'failed';

  return (
    <motion.div
      ref={(el) => onSetRef(message.id, el)}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: message.status === 'sending' ? 0.6 : 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={() => {
        if (selectMode) {
          onToggleSelect?.(message.id);
        } else if (!isPending) {
          setActionsOpen((v) => !v);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!selectMode) onLongPress?.(message.id);
      }}
      className={cn(
        'group/bubble relative w-fit max-w-[75%] rounded-2xl px-3.5 py-2 transition-colors duration-700',
        isOwn ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md',
        isHighlighted && 'bg-primary/20'
      )}
    >
      {/* Selection checkbox (visible only in select mode) */}
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

      {/* Reply Preview */}
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

      <div className="mt-0.5 flex items-center justify-end gap-1">
        {message.editedAt && (
          <span
            className={cn(
              'text-[10px]',
              isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground/60'
            )}
          >
            ویرایش شده
          </span>
        )}
        {message.status === 'sending' && (
          <Loader2 className="text-primary-foreground/70 h-3 w-3 animate-spin" />
        )}
        {message.status === 'failed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (message.clientId) onRetry?.(message.clientId);
            }}
            className="text-destructive flex items-center gap-1 text-[10px] hover:underline"
          >
            <AlertCircle className="h-3 w-3" />
            ارسال نشد، تلاش دوباره
          </button>
        )}
      </div>

      {/* Action buttons (hidden in select mode) */}
      {!isPending && !selectMode && (
        <MessageActions
          isOwn={isOwn}
          message={message}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          forceVisible={actionsOpen}
          onActionTaken={() => setActionsOpen(false)}
        />
      )}
    </motion.div>
  );
}

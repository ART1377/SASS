'use client';

import { cn } from '@/shared/lib/utils';
import { AlertCircle, Copy, Loader2, Pencil, Reply, Trash2 } from 'lucide-react';
import type { ChatMessage, ReplyInfo } from '../types';

interface MessageFooterProps {
  message: ChatMessage;
  isOwn: boolean;
  isPending: boolean;
  selectMode?: boolean;
  onReply: (message: ReplyInfo) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onRetry?: (clientId: string) => void;
  onCopy?: (content: string) => void;
}

export function MessageFooter({
  message,
  isOwn,
  isPending,
  selectMode,
  onReply,
  onEdit,
  onDelete,
  onRetry,
  onCopy,
}: MessageFooterProps) {
  return (
    <div className={cn('mt-0.5 flex items-center gap-1', isOwn ? 'justify-end' : 'justify-start')}>
      {message.editedAt && (
        <span className="me-auto min-w-fit text-[10px] opacity-50">ویرایش شده</span>
      )}
      {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin opacity-60" />}
      {message.status === 'failed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (message.clientId) onRetry?.(message.clientId);
          }}
          className="text-destructive flex items-center gap-0.5 text-[10px] hover:underline"
        >
          <AlertCircle className="h-3 w-3" />
          ارسال نشد
        </button>
      )}

      {!isPending && !selectMode && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy?.(message.content);
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full opacity-40 transition-all hover:bg-black/5 hover:opacity-80 dark:hover:bg-white/10"
            aria-label="کپی"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReply({
                id: message.id,
                content: message.content,
                sender: { id: message.sender.id, name: message.sender.name },
              });
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full opacity-40 transition-all hover:bg-black/5 hover:opacity-80 dark:hover:bg-white/10"
            aria-label="پاسخ"
          >
            <Reply className="h-3 w-3" />
          </button>
          {isOwn && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(message.id, message.content);
                }}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full opacity-40 transition-all hover:bg-black/5 hover:text-blue-500 hover:opacity-80 dark:hover:bg-white/10"
                aria-label="ویرایش"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(message.id);
                }}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full opacity-40 transition-all hover:bg-black/5 hover:text-red-500 hover:opacity-80 dark:hover:bg-white/10"
                aria-label="حذف"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

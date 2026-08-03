'use client';

import { cn } from '@/shared/lib/utils';
import { Pencil, Reply, Trash2 } from 'lucide-react';
import type { ChatMessage, ReplyInfo } from '../types';

interface MessageActionsProps {
  isOwn: boolean;
  message: ChatMessage;
  onReply: (message: ReplyInfo) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

export function MessageActions({ isOwn, message, onReply, onEdit, onDelete }: MessageActionsProps) {
  return (
    <div
      className={cn(
        'absolute -top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover/bubble:opacity-100',
        isOwn ? '-left-16' : '-right-4'
      )}
    >
      <ActionButton
        onClick={() =>
          onReply({
            id: message.id,
            content: message.content,
            sender: { id: message.sender.id, name: message.sender.name },
          })
        }
      >
        <Reply className="text-muted-foreground h-3.5 w-3.5" />
      </ActionButton>
      {isOwn && (
        <ActionButton onClick={() => onEdit?.(message.id, message.content)}>
          <Pencil className="text-muted-foreground h-3.5 w-3.5" />
        </ActionButton>
      )}
      {isOwn && (
        <ActionButton destructive onClick={() => onDelete?.(message.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </ActionButton>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  destructive,
}: {
  children: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-background cursor-pointer rounded-full border p-1 shadow-sm transition-colors',
        destructive
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-muted-foreground hover:bg-muted'
      )}
    >
      {children}
    </button>
  );
}

'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn, getInitials } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import type { MessageGroup, ReplyInfo } from '../types';
import { MessageBubble } from './message-bubble';

interface MessageGroupProps {
  group: MessageGroup;
  isFirst: boolean;
  onReply: (message: ReplyInfo) => void;
  highlightedId: string | null;
  onSetRef: (id: string, el: HTMLDivElement | null) => void;
  onReplyClick?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onRetry?: (clientId: string) => void;
  selectMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onLongPress?: (id: string) => void;
  onCopy?: (content: string) => void;
}

export function MessageGroupBubble({
  group,
  isFirst,
  onReply,
  highlightedId,
  onSetRef,
  onReplyClick,
  onEdit,
  onDelete,
  onRetry,
  selectMode,
  selectedIds,
  onToggleSelect,
  onLongPress,
  onCopy,
}: MessageGroupProps) {
  return (
    <motion.div
      initial={isFirst ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group/message flex items-end gap-2',
        group.isOwn ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {!group.isOwn && (
        <Avatar className="ring-border h-7 w-7 shrink-0 ring-2">
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
            {getInitials(group.sender.name)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn('flex w-full flex-col space-y-1', group.isOwn ? 'items-start' : 'items-end')}
      >
        {!group.isOwn && (
          <p className="text-muted-foreground px-1 text-[10px] font-medium">{group.sender.name}</p>
        )}
        {group.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={group.isOwn}
            isHighlighted={highlightedId === msg.id}
            onReply={onReply}
            onSetRef={onSetRef}
            onReplyClick={onReplyClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onRetry={onRetry}
            selectMode={selectMode}
            isSelected={selectedIds?.has(msg.id)}
            onToggleSelect={onToggleSelect}
            onLongPress={onLongPress}
            onCopy={onCopy}
          />
        ))}
      </div>
    </motion.div>
  );
}

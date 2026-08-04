'use client';

import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { Pencil, Reply, Trash2 } from 'lucide-react';
import type { ChatMessage, ReplyInfo } from '../types';

interface MessageActionsProps {
  isOwn: boolean;
  message: ChatMessage;
  onReply: (message: ReplyInfo) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

const actionButtonBase =
  'flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-pointer border shadow-sm';

const actionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export function MessageActions({ isOwn, message, onReply, onEdit, onDelete }: MessageActionsProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'absolute top-0 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover/bubble:opacity-100',
        isOwn ? '-left-28' : '-right-10'
      )}
    >
      {/* Reply */}
      <motion.button
        variants={actionVariants}
        transition={{ delay: 0 }}
        onClick={() =>
          onReply({
            id: message.id,
            content: message.content,
            sender: { id: message.sender.id, name: message.sender.name },
          })
        }
        className={cn(
          actionButtonBase,
          'bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30'
        )}
      >
        <Reply className="h-3.5 w-3.5" />
      </motion.button>

      {/* Edit - only own messages */}
      {isOwn && (
        <motion.button
          variants={actionVariants}
          transition={{ delay: 0.05 }}
          onClick={() => onEdit?.(message.id, message.content)}
          className={cn(
            actionButtonBase,
            'bg-background text-muted-foreground hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-400'
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
        </motion.button>
      )}

      {/* Delete - only own messages */}
      {isOwn && (
        <motion.button
          variants={actionVariants}
          transition={{ delay: 0.1 }}
          onClick={() => onDelete?.(message.id)}
          className={cn(
            actionButtonBase,
            'bg-background text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400'
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </motion.button>
      )}
    </motion.div>
  );
}

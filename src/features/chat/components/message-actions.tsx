'use client';

import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Pencil, Reply, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ChatMessage, ReplyInfo } from '../types';

interface MessageActionsProps {
  isOwn: boolean;
  message: ChatMessage;
  onReply: (message: ReplyInfo) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  forceVisible?: boolean;
  onActionTaken?: () => void;
}

const actionButtonBase =
  'flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-pointer border shadow-sm';

const actionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export function MessageActions({
  isOwn,
  message,
  onReply,
  onEdit,
  onDelete,
  forceVisible,
  onActionTaken,
}: MessageActionsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('پیام کپی شد');
    } catch {
      toast.error('خطا در کپی پیام');
    }
    onActionTaken?.();
  };

  return (
    <AnimatePresence>
      {(forceVisible ?? true) && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'absolute top-0 flex items-center gap-1.5 transition-opacity duration-200',
            isOwn ? '-left-40' : '-right-20',
            forceVisible ? 'opacity-100' : 'opacity-0 group-hover/bubble:opacity-100'
          )}
        >
          {/* Copy */}
          <motion.button
            variants={actionVariants}
            transition={{ delay: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            aria-label="کپی پیام"
            className={cn(
              actionButtonBase,
              'bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30'
            )}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.button>

          {/* Reply */}
          <motion.button
            variants={actionVariants}
            transition={{ delay: 0.03 }}
            onClick={(e) => {
              e.stopPropagation();
              onReply({
                id: message.id,
                content: message.content,
                sender: { id: message.sender.id, name: message.sender.name },
              });
              onActionTaken?.();
            }}
            aria-label="پاسخ به پیام"
            className={cn(
              actionButtonBase,
              'bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30'
            )}
          >
            <Reply className="h-3.5 w-3.5" />
          </motion.button>

          {isOwn && (
            <motion.button
              variants={actionVariants}
              transition={{ delay: 0.06 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(message.id, message.content);
                onActionTaken?.();
              }}
              aria-label="ویرایش پیام"
              className={cn(
                actionButtonBase,
                'bg-background text-muted-foreground hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-400'
              )}
            >
              <Pencil className="h-3.5 w-3.5" />
            </motion.button>
          )}

          {isOwn && (
            <motion.button
              variants={actionVariants}
              transition={{ delay: 0.09 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(message.id);
                onActionTaken?.();
              }}
              aria-label="حذف پیام"
              className={cn(
                actionButtonBase,
                'bg-background text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400'
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

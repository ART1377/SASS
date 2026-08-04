'use client';

import { motion } from 'framer-motion';
import { Reply, X } from 'lucide-react';
import type { ReplyInfo } from '../types';

interface ReplyPreviewProps {
  replyTo: ReplyInfo;
  onClear: () => void;
  onClick?: () => void;
}

export function ReplyPreview({ replyTo, onClear, onClick }: ReplyPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="bg-muted/30 flex items-center gap-2 border-b px-4 py-2"
    >
      <Reply className="text-primary h-4 w-4 shrink-0" />
      <button type="button" className="min-w-0 flex-1 text-right" onClick={onClick}>
        <p className="text-primary text-xs font-medium">{replyTo.sender.name}</p>
        <p className="text-muted-foreground truncate text-xs">{replyTo.content}</p>
      </button>
      <button
        onClick={onClear}
        aria-label="لغو پاسخ"
        className="hover:bg-muted rounded-lg p-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { getInitials } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import type { TypingUser } from '../types';

export function TypingIndicator({ users }: { users: TypingUser[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
      <Avatar className="ring-border h-7 w-7 shrink-0 ring-2">
        <AvatarFallback className="bg-primary/10 text-[10px]">
          {getInitials(users[0]?.userName || '')}
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted flex gap-1 rounded-full px-3 py-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="bg-muted-foreground/40 h-1.5 w-1.5 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs">
        {users.map((u) => u.userName).join(', ')} در حال تایپ...
      </span>
    </motion.div>
  );
}

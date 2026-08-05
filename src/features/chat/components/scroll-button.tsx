'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ScrollButtonProps {
  visible: boolean;
  onClick: () => void;
}

export function ScrollButton({ visible, onClick }: ScrollButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={onClick}
          aria-label="پیمایش به پایین"
          className="bg-primary text-primary-foreground shadow-primary/25 sticky bottom-4 left-1/2 z-20 mx-auto flex w-fit -translate-x-1/2 cursor-pointer! items-center gap-2 rounded-full p-3 text-xs font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

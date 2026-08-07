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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          aria-label="پیمایش به پایین"
          className="bg-primary text-primary-foreground shadow-primary/25 absolute right-1/2 bottom-4 z-20 translate-x-1/2 cursor-pointer! rounded-full p-3 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

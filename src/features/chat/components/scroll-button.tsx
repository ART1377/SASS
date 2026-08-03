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
          onClick={onClick}
          className="bg-background hover:bg-muted sticky bottom-4 left-1/2 z-10 mx-auto flex w-fit -translate-x-1/2 cursor-pointer items-center rounded-full border p-2 text-xs shadow-lg transition-colors"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

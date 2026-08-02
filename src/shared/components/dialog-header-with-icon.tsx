'use client';

import { DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface DialogHeaderWithIconProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function DialogHeaderWithIcon({
  icon: Icon,
  title,
  description,
}: DialogHeaderWithIconProps) {
  return (
    <DialogHeader>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl"
        >
          <Icon className="text-primary h-5 w-5" />
        </motion.div>
        <div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
      </motion.div>
    </DialogHeader>
  );
}

'use client';

import { motion } from 'framer-motion';

function formatSeparatorLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'امروز';
  if (isSameDay(date, yesterday)) return 'دیروز';

  return new Intl.DateTimeFormat('fa-IR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function DateSeparator({ date }: { date: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-[1] flex items-center justify-center py-2"
    >
      <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[11px] font-medium shadow-sm">
        {formatSeparatorLabel(date)}
      </span>
    </motion.div>
  );
}

export function isDifferentDay(a: string, b: string): boolean {
  const dA = new Date(a);
  const dB = new Date(b);
  return (
    dA.getFullYear() !== dB.getFullYear() ||
    dA.getMonth() !== dB.getMonth() ||
    dA.getDate() !== dB.getDate()
  );
}

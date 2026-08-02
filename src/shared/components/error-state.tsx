'use client';

import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'خطایی رخ داد',
  message = 'مشکلی در بارگذاری اطلاعات پیش آمده است',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ delay: 0.2, duration: 0.5 }}>
        <AlertCircle className="text-destructive h-12 w-12" />
      </motion.div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="ml-2 h-4 w-4" />
          تلاش مجدد
        </Button>
      )}
    </motion.div>
  );
}

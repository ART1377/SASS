'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export function ToastConfig() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '14px',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
        },
        success: {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          },
        },
        error: {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          },
        },
      }}
    />
  );
}

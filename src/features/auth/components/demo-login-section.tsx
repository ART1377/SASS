'use client';

import { Zap } from 'lucide-react';

interface DemoLoginSectionProps {
  onDemoLogin: () => void;
  isLoading: boolean;
}

export function DemoLoginSection({ onDemoLogin, isLoading }: DemoLoginSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-px">
      {/* Animated gradient border */}
      <div
        className="animate-gradient absolute inset-0 rounded-2xl bg-linear-to-r from-rose-500 via-amber-500 to-rose-500 opacity-50"
        style={{ backgroundSize: '200% 200%' }}
      />

      <div className="bg-card relative rounded-2xl p-4">
        {/* Pulse dot */}
        <div className="mb-3 flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
          </span>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            ورود سریع با اکانت آزمایشی
          </span>
        </div>

        {/* Demo Button */}
        <button
          type="button"
          onClick={onDemoLogin}
          disabled={isLoading}
          className="group relative flex w-full cursor-pointer! items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-linear-to-r from-rose-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:from-rose-600 hover:to-rose-700 hover:shadow-xl hover:shadow-rose-500/30 active:scale-[0.98] disabled:opacity-50"
        >
          <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              در حال ورود...
            </span>
          ) : (
            'ورود سریع به سیستم'
          )}
        </button>

        {/* Description */}
        <p className="text-muted-foreground/70 mt-3 border-t border-rose-500/10 pt-3 text-center text-[10px] leading-relaxed">
          بدون نیاز به ثبت‌نام، به‌عنوان{' '}
          <span className="font-semibold text-rose-600 dark:text-rose-400">مدیر سیستم</span> با{' '}
          <span className="font-semibold text-rose-600 dark:text-rose-400">داده‌های واقعی</span>{' '}
          وارد شوید و تمام امکانات را بررسی کنید
        </p>
      </div>
    </div>
  );
}

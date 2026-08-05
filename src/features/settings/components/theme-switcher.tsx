'use client';

import { cn } from '@/shared/lib/utils';
import { Check, Moon, Sun } from 'lucide-react';
import { useThemeSwitcher } from '../hooks/use-theme-switcher';

export function ThemeSwitcher() {
  const { mounted, isDark, themeColors, setMode, setColor, isColorActive } = useThemeSwitcher();

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-muted/30 h-17 animate-pulse rounded-2xl" />
        <div className="bg-muted/30 h-25 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Light/Dark Toggle */}
      <div className="bg-muted/40 flex items-center rounded-2xl p-1">
        <button
          onClick={() => setMode('light')}
          className={cn(
            'flex flex-1 cursor-pointer! items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-300',
            !isDark
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Sun className="h-4 w-4" />
          روشن
        </button>
        <button
          onClick={() => setMode('dark')}
          className={cn(
            'flex flex-1 cursor-pointer! items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-300',
            isDark
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Moon className="h-4 w-4" />
          تاریک
        </button>
      </div>

      {/* Colors */}
      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium">رنگ تم</p>
        <div className="flex items-center gap-2 sm:gap-3">
          {themeColors.map((color) => {
            const isActive = isColorActive(color.value);
            return (
              <button
                key={color.value}
                onClick={() => setColor(color.value)}
                className="group relative flex flex-1 cursor-pointer! flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    'h-10 w-10 rounded-xl bg-linear-to-br shadow-md transition-all duration-300 sm:h-12 sm:w-12',
                    color.gradient,
                    isActive
                      ? 'ring-offset-background scale-110 shadow-lg ring-2 ring-offset-2'
                      : 'group-hover:scale-105'
                  )}
                >
                  {isActive && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Check className="h-5 w-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] transition-colors sm:text-xs',
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {color.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

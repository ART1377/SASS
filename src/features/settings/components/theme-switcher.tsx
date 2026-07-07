'use client';

import { cn } from '@/shared/lib/utils';
import { Check, Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themeOptions = [
  {
    label: 'بنفش',
    value: 'purple-light',
    darkValue: 'purple-dark',
    gradient: 'from-purple-400 to-purple-600',
    ring: 'ring-purple-500',
  },
  {
    label: 'سبز',
    value: 'green-light',
    darkValue: 'green-dark',
    gradient: 'from-emerald-400 to-emerald-600',
    ring: 'ring-emerald-500',
  },
  {
    label: 'آبی',
    value: 'blue-light',
    darkValue: 'blue-dark',
    gradient: 'from-blue-400 to-blue-600',
    ring: 'ring-blue-500',
  },
  {
    label: 'نارنجی',
    value: 'orange-light',
    darkValue: 'orange-dark',
    gradient: 'from-orange-400 to-orange-600',
    ring: 'ring-orange-500',
  },
  {
    label: 'رز',
    value: 'rose-light',
    darkValue: 'rose-dark',
    gradient: 'from-rose-400 to-rose-600',
    ring: 'ring-rose-500',
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(theme?.includes('dark') || theme === 'dark');
  }, [theme]);

  if (!mounted) return null;

  const handleThemeChange = (lightValue: string, darkValue: string) => {
    setTheme(isDark ? darkValue : lightValue);
  };

  const toggleDarkMode = () => {
    const currentTheme = theme || 'purple-light';
    if (currentTheme.includes('dark') || currentTheme === 'dark') {
      setTheme(currentTheme.replace('-dark', '-light').replace('dark', 'light'));
    } else {
      setTheme(currentTheme === 'light' ? 'dark' : currentTheme.replace('-light', '-dark'));
    }
  };

  const getCurrentBaseTheme = () => {
    if (!theme) return 'purple';
    for (const opt of themeOptions) {
      if (theme.includes(opt.value.split('-')[0])) return opt.value.split('-')[0];
    }
    if (theme === 'light' || theme === 'dark') return 'neutral';
    return 'purple';
  };

  return (
    <div className="space-y-8">
      {/* Dark/Light Toggle */}
      <div>
        <label className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
          <Palette className="h-4 w-4" />
          حالت نمایش
        </label>
        <div className="bg-muted/50 flex items-center gap-1 rounded-2xl p-1.5">
          <button
            onClick={() => {
              setIsDark(false);
              toggleDarkMode();
            }}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-300',
              !isDark
                ? 'bg-background text-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">روشن</span>
          </button>
          <button
            onClick={() => {
              setIsDark(true);
              toggleDarkMode();
            }}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-300',
              isDark
                ? 'bg-background text-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">تاریک</span>
          </button>
        </div>
      </div>

      {/* Color Themes */}
      <div>
        <label className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-medium">
          <Palette className="h-4 w-4" />
          رنگ تم
        </label>
        <div className="grid grid-cols-5 gap-3">
          {themeOptions.map((option) => {
            const isActive = getCurrentBaseTheme() === option.value.split('-')[0];
            return (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value, option.darkValue)}
                className={cn(
                  'group relative flex flex-col items-center gap-3 rounded-2xl p-3 transition-all duration-300 sm:p-4',
                  isActive ? `bg-muted ring-2 ring-offset-2 ${option.ring}` : 'hover:bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-14 sm:w-14',
                    option.gradient
                  )}
                >
                  {isActive && (
                    <Check className="h-5 w-5 text-white drop-shadow-lg sm:h-6 sm:w-6" />
                  )}
                </div>
                <span className="text-[10px] font-medium sm:text-xs">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

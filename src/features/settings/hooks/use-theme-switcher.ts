'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

export const THEME_COLORS = [
  {
    label: 'بنفش',
    value: 'purple',
    gradient: 'from-purple-400 to-purple-600',
    ring: 'ring-purple-500',
  },
  {
    label: 'سبز',
    value: 'green',
    gradient: 'from-emerald-400 to-emerald-600',
    ring: 'ring-emerald-500',
  },
  { label: 'آبی', value: 'blue', gradient: 'from-blue-400 to-blue-600', ring: 'ring-blue-500' },
  {
    label: 'نارنجی',
    value: 'orange',
    gradient: 'from-orange-400 to-orange-600',
    ring: 'ring-orange-500',
  },
  { label: 'رز', value: 'rose', gradient: 'from-rose-400 to-rose-600', ring: 'ring-rose-500' },
] as const;

export type ThemeColor = (typeof THEME_COLORS)[number]['value'];

export function useThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme?.includes('dark') || theme === 'dark' : false;
  const currentColor: ThemeColor = mounted
    ? (theme?.split('-')[0] as ThemeColor) || 'purple'
    : 'purple';

  const setMode = useCallback(
    (mode: 'light' | 'dark') => {
      setTheme(`${currentColor}-${mode}`);
    },
    [currentColor, setTheme]
  );

  const toggleMode = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  const setColor = useCallback(
    (color: ThemeColor) => {
      const mode = isDark ? 'dark' : 'light';
      setTheme(`${color}-${mode}`);
    },
    [isDark, setTheme]
  );

  const isColorActive = useCallback((color: ThemeColor) => currentColor === color, [currentColor]);

  return {
    mounted,
    isDark,
    currentColor,
    setMode,
    toggleMode,
    setColor,
    isColorActive,
    themeColors: THEME_COLORS,
  };
}

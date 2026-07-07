'use client';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={[
        'light',
        'dark',
        'purple-light',
        'purple-dark',
        'green-light',
        'green-dark',
        'blue-light',
        'blue-dark',
        'orange-light',
        'orange-dark',
        'rose-light',
        'rose-dark',
      ]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

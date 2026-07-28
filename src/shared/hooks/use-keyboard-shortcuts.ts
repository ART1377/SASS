'use client';

import { ROUTES } from '@/shared/lib/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const shortcuts: Shortcut[] = [
      {
        key: 'd',
        ctrlKey: true,
        action: () => router.push(ROUTES.DASHBOARD),
        description: 'رفتن به داشبورد',
      },
      {
        key: 'p',
        ctrlKey: true,
        action: () => router.push(ROUTES.PROJECTS),
        description: 'رفتن به پروژه‌ها',
      },
      {
        key: 't',
        ctrlKey: true,
        action: () => router.push(ROUTES.TASKS),
        description: 'رفتن به تسک‌ها',
      },
      {
        key: 'c',
        ctrlKey: true,
        action: () => router.push(ROUTES.CHAT),
        description: 'رفتن به چت',
      },
      {
        key: 'n',
        ctrlKey: true,
        action: () => router.push(ROUTES.NOTIFICATIONS),
        description: 'رفتن به اعلان‌ها',
      },
      {
        key: 'k',
        ctrlKey: true,
        action: () => {
          // Open command palette (future feature)
          console.log('Command palette');
        },
        description: 'باز کردن پنل فرمان',
      },
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
        const needsCtrl = shortcut.ctrlKey !== undefined;
        const needsMeta = shortcut.metaKey !== undefined;

        if (
          event.key.toLowerCase() === shortcut.key &&
          (needsCtrl ? event.ctrlKey : true) &&
          (needsMeta ? event.metaKey : true)
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}

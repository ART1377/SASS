'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useKeyboardShortcuts } from '@/shared/hooks/use-keyboard-shortcuts';
import { Keyboard } from 'lucide-react';

const shortcutsList = [
  { keys: 'Ctrl + D', description: 'رفتن به داشبورد' },
  { keys: 'Ctrl + P', description: 'رفتن به پروژه‌ها' },
  { keys: 'Ctrl + T', description: 'رفتن به تسک‌ها' },
  { keys: 'Ctrl + C', description: 'رفتن به چت' },
  { keys: 'Ctrl + N', description: 'رفتن به اعلان‌ها' },
  { keys: 'Ctrl + K', description: 'باز کردن پنل فرمان' },
  { keys: 'Ctrl + B', description: 'باز/بسته کردن سایدبار' },
  { keys: 'Esc', description: 'بستن مودال‌ها' },
];

export function KeyboardShortcuts() {
  useKeyboardShortcuts();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          میانبرها
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>میانبرهای کیبورد</DialogTitle>
          <DialogDescription>برای افزایش سرعت کار با تسک منیجر</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 pt-4">
          {shortcutsList.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <span className="text-muted-foreground text-sm">{shortcut.description}</span>
              <kbd className="bg-muted rounded-md px-2 py-1 font-mono text-xs font-semibold">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

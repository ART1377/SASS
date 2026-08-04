'use client';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="اعلان‌ها">
          <Bell className="text-primary h-5 w-5" aria-hidden="true" />
          <AnimatePresence mode="wait">
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: 2, duration: 0.5, delay: 0.3 }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="text-sm font-semibold">اعلان‌ها</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => markAllAsRead()}>
              خواندن همه
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="text-muted-foreground/30 mx-auto h-8 w-8" aria-hidden="true" />
              <p className="text-muted-foreground mt-2 text-sm">اعلانی وجود ندارد</p>
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={() => setOpen(false)}
              />
            ))
          )}
        </div>
        {notifications.length > 5 && (
          <div className="border-t p-2 text-center">
            <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
              <Link href="/notifications">مشاهده همه اعلان‌ها</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

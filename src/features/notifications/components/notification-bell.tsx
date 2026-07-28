'use client';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Bell } from 'lucide-react';
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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground animate-in zoom-in absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
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
              <Bell className="text-muted-foreground/30 mx-auto h-8 w-8" />
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
              <a href="/notifications">مشاهده همه اعلان‌ها</a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

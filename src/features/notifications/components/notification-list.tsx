'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/shared/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';
import { NotificationItemSkeleton } from './notification-item-skeleton';

export function NotificationList() {
  const { notifications, isLoading, markAllAsRead, unreadCount, isMarkingAll } = useNotifications();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border">
        {Array.from({ length: 5 }).map((_, i) => (
          <NotificationItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="اعلانی وجود ندارد"
        description="وقتی تسکی به شما اختصاص داده شود یا تغییری در پروژه‌ها ایجاد شود، اینجا نمایش داده می‌شود"
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده` : 'همه اعلان‌ها خوانده شده‌اند'}
        </p>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            خواندن همه
          </Button>
        )}
      </div>
      <div className="bg-card rounded-xl border">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onClose={() => {}} />
        ))}
      </div>
    </div>
  );
}

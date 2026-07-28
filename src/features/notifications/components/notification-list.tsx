'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Button } from '@/shared/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';

export function NotificationList() {
  const { notifications, isLoading, markAllAsRead, unreadCount, isMarkingAll } = useNotifications();

  if (isLoading) {
    return <LoadingSkeleton type="list" count={5} />;
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

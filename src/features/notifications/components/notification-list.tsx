'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/shared/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';
import { NotificationItemSkeleton } from './notification-item-skeleton';

type FilterType = 'all' | 'unread' | 'read';

export function NotificationList() {
  const { notifications, isLoading, markAllAsRead, unreadCount, isMarkingAll } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'read':
        return notifications.filter((n) => n.isRead);
      default:
        return notifications;
    }
  }, [notifications, filter]);

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
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted/50 flex items-center gap-1 rounded-xl p-1">
          {(
            [
              { key: 'all', label: `همه (${notifications.length})` },
              { key: 'unread', label: `خوانده نشده (${unreadCount})` },
              { key: 'read', label: `خوانده شده (${readCount})` },
            ] as const
          ).map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(key)}
              className="rounded-lg text-xs"
            >
              {label}
            </Button>
          ))}
        </div>

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

      {/* Filtered list */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="اعلانی یافت نشد"
          description={
            filter === 'unread'
              ? 'همه اعلان‌ها خوانده شده‌اند'
              : filter === 'read'
                ? 'هنوز اعلانی خوانده نشده'
                : 'اعلانی وجود ندارد'
          }
        />
      ) : (
        <div className="bg-card rounded-xl border">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

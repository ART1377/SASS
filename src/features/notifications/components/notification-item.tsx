'use client';

import { cn, formatDateTime } from '@/shared/lib/utils';
import { CheckCheck } from 'lucide-react';
import { NOTIFICATION_COLORS, NOTIFICATION_ICONS, NOTIFICATION_LABELS } from '../constants';
import { useNotifications } from '../hooks/use-notifications';
import type { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { markAsRead } = useNotifications();
  const Icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.DEFAULT;
  const colorClass = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.DEFAULT;
  const label = NOTIFICATION_LABELS[notification.type] || 'اعلان';

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsRead([notification.id]);
    }
  };

  return (
    <div
      onClick={onClose}
      className={cn(
        'hover:bg-muted/50 border-border/60 dark:border-border/40 flex w-full cursor-pointer items-start gap-3 border-b p-3 text-right transition-colors',
        !notification.isRead && 'bg-muted/60'
      )}
    >
      {/* Type Icon */}
      <div
        className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', colorClass)}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{notification.title}</p>

          {/* Read Status Indicator */}
          <button
            onClick={handleMarkAsRead}
            className="group shrink-0"
            title={notification.isRead ? 'خوانده شده' : 'علامت به عنوان خوانده شده'}
            aria-label={notification.isRead ? 'خوانده شده' : 'علامت به عنوان خوانده شده'}
          >
            {notification.isRead ? (
              <CheckCheck className="text-primary/60 h-4 w-4" />
            ) : (
              <span className="bg-primary block h-2.5 w-2.5 rounded-full" />
            )}
          </button>
        </div>

        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{notification.message}</p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-muted-foreground/70 text-[10px]">
            {formatDateTime(notification.createdAt)}
          </span>
          <span className="text-muted-foreground/50 text-[10px]">•</span>
          <span className="text-muted-foreground/70 text-[10px]">{label}</span>
        </div>
      </div>
    </div>
  );
}

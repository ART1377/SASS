'use client';

import { StatusBadge } from '@/shared/components/ui/status-badge';
import { cn, formatDateTime } from '@/shared/lib/utils';
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

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead([notification.id]);
    }
    onClose();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'hover:bg-muted/50 flex w-full items-start gap-3 border-b p-3 text-right transition-colors',
        !notification.isRead && 'bg-primary/5'
      )}
    >
      <span className="text-muted-foreground/70 text-[10px]">
        <StatusBadge status={notification.type} label={label} size="xs" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{notification.title}</p>
          {!notification.isRead && <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />}
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
    </button>
  );
}

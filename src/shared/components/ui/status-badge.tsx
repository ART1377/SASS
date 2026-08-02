// src/shared/components/ui/status-badge.tsx
import { cn } from '@/shared/lib/utils';
import { Badge } from './badge';

type BadgeVariant = 'dot' | 'solid' | 'outline';
type BadgeSize = 'xs' | 'sm' | 'md';

interface StatusBadgeProps {
  status: string;
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  // Task Status
  TODO: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  REVIEW: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  DONE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',

  // Priority
  LOW: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  URGENT: 'bg-red-500/10 text-red-500 border-red-500/20',

  // Notification Types
  TASK_ASSIGNED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  TASK_UPDATED: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  COMMENT_ADDED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  PROJECT_INVITE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  MENTION: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
} as const;

const DOT_COLOR_MAP: Record<string, string> = {
  LOW: 'bg-gray-400',
  MEDIUM: 'bg-blue-400',
  HIGH: 'bg-orange-400',
  URGENT: 'bg-red-400',
};

const SIZE_MAP: Record<BadgeSize, string> = {
  xs: 'text-[9px] px-1.5 py-0',
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function StatusBadge({
  status,
  label,
  variant = 'outline',
  size = 'sm',
  className,
}: StatusBadgeProps) {
  const colorClass = STATUS_COLOR_MAP[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  const dotColor = DOT_COLOR_MAP[status];
  const sizeClass = SIZE_MAP[size];

  return (
    <Badge
      variant={variant === 'solid' ? 'secondary' : 'outline'}
      className={cn('gap-1', sizeClass, colorClass, className)}
    >
      {variant === 'dot' && dotColor && (
        <div className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />
      )}
      {label}
    </Badge>
  );
}

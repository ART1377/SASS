import { cn } from '@/shared/lib/utils';

interface OnlineBadgeProps {
  isOnline: boolean;
  className?: string;
}

export function OnlineBadge({ isOnline, className }: OnlineBadgeProps) {
  if (!isOnline) return null;

  return (
    <span
      className={cn(
        'border-background absolute -right-0.5 -bottom-0.5 block h-3 w-3 rounded-full border-2 bg-emerald-500',
        className
      )}
    />
  );
}

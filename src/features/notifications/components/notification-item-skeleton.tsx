import { Skeleton } from '@/shared/components/ui/skeleton';

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b p-3">
      <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
        </div>

        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-3/4 rounded-md" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-2.5 w-24 rounded" />
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

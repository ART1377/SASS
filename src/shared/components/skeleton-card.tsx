import { Skeleton } from '@/shared/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <div className="bg-card space-y-3 rounded-2xl border-0 p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-card space-y-4 rounded-2xl border-0 p-6 shadow-lg">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-60" />
      <Skeleton className="h-75 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-card flex items-center gap-4 rounded-xl p-4 shadow-sm">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from '@/shared/components/ui/skeleton';

export function ChatRoomListSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <Skeleton className="h-5 w-16 rounded-lg" />
        <Skeleton className="mt-3 h-10 w-full rounded-xl" />
      </div>

      {/* Room items */}
      <div className="flex-1 space-y-1 p-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-2.5 w-12 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded-md" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-32 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

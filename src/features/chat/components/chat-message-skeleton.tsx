import { Skeleton } from '@/shared/components/ui/skeleton';

export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
      <div
        className={`max-w-[75%] space-y-2 rounded-2xl px-3.5 py-2 ${
          isOwn ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
      >
        <Skeleton className="h-3 w-40 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="mt-1 h-2 w-12 rounded-md" />
      </div>
    </div>
  );
}

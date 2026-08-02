import { Skeleton } from '@/shared/components/ui/skeleton';

export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar - فقط برای دیگران */}
      {!isOwn && <Skeleton className="h-7 w-7 shrink-0 rounded-full" />}

      <div className="max-w-[75%] space-y-1">
        {/* Sender name - فقط برای دیگران */}
        {!isOwn && <Skeleton className="h-2.5 w-16 rounded-md" />}

        {/* Message bubbles */}
        <div className="space-y-1">
          <div className={`rounded-2xl px-3.5 py-2 ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}>
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
          <div className={`rounded-2xl px-3.5 py-2 ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}>
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
          <div className={`rounded-2xl px-3.5 py-2 ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}>
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* Timestamp */}
        <Skeleton className="mt-1 h-2 w-10 rounded-md" />
      </div>
    </div>
  );
}

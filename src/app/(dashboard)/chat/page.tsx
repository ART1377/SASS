import Chat from '@/features/chat';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Suspense } from 'react';

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="list" count={5} />}>
      <Chat />
    </Suspense>
  );
}

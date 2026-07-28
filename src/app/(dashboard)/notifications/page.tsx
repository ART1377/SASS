import Notifications from '@/features/notifications';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Suspense } from 'react';

export default function NotificationsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="list" count={5} />}>
      <Notifications />
    </Suspense>
  );
}

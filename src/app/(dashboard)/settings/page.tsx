import Settings from '@/features/settings';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Suspense } from 'react';

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="card" count={2} />}>
      <Settings />
    </Suspense>
  );
}

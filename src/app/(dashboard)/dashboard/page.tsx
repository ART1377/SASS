import Dashboard from '@/features/dashboard';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Suspense } from 'react';

export default async function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="card" count={4} />}>
      <Dashboard />
    </Suspense>
  );
}

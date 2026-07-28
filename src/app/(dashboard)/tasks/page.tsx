import Tasks from '@/features/tasks';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Suspense } from 'react';

export default function TasksPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="kanban" count={3} />}>
      <Tasks />
    </Suspense>
  );
}

import Projects from '@/features/projects';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Suspense } from 'react';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="card" count={6} />}>
      <Projects />
    </Suspense>
  );
}

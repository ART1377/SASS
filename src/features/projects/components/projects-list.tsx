'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { FolderKanban } from 'lucide-react';
import { useProjects } from '../hooks/use-projects';
import type { Project } from '../types';
import { CreateProjectDialog } from './create-project-dialog';
import { ProjectCard } from './project-card';

export function ProjectsList() {
  const { projects, isLoading, isError, deleteProject } = useProjects();

  if (isLoading) {
    return <LoadingSkeleton type="card" count={6} />;
  }

  if (isError) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="پروژه‌ای یافت نشد"
        description="هنوز هیچ پروژه‌ای ایجاد نکرده‌اید. اولین پروژه خود را بسازید!"
        action={<CreateProjectDialog />}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => {}}
          onDelete={() => deleteProject(project.id)}
        />
      ))}
    </div>
  );
}

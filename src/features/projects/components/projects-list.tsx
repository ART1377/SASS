'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { SearchInput } from '@/shared/components/ui/search-input';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProjects } from '../hooks/use-projects';
import type { Project } from '../types';
import { CreateProjectDialog } from './create-project-dialog';
import { EditProjectDialog } from './edit-project-dialog';
import { ProjectCard } from './project-card';
import { ProjectCardSkeleton } from './project-card-skeleton';

export function ProjectsList() {
  const { projects, isLoading, isError, deleteProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(
    () =>
      searchQuery
        ? projects.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : projects,
    [projects, searchQuery]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
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
    <div className="space-y-4">
      {/* Header: Search + Create */}
      <SearchInput placeholder="جستجوی پروژه..." onSearch={setSearchQuery} className="flex-1" />

      {/* No results */}
      {searchQuery && filteredProjects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="نتیجه‌ای یافت نشد"
          description={`پروژه‌ای با "${searchQuery}" پیدا نشد`}
        />
      )}

      {/* Grid */}
      {filteredProjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: Project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  onEdit={setEditingProject}
                  onDelete={() => deleteProject(project.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Dialog */}
      {editingProject && (
        <EditProjectDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => {
            if (!open) setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}

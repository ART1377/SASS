'use client';

import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Button } from '@/shared/components/ui/button';
import { SearchInputURL } from '@/shared/components/ui/search-input-url';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderKanban, Plus } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { useProjects } from '../hooks/use-projects';
import type { Project } from '../types';
import { InviteMemberDialog } from './invite-member-dialog';
import { ProjectCard } from './project-card';
import { ProjectCardSkeleton } from './project-card-skeleton';
import { ProjectDialog } from './project-dialog';

export function ProjectsList() {
  const [searchQuery] = useQueryState('q', { defaultValue: '' });
  const { projects, isLoading, isError, deleteProject, isDeleting } = useProjects({
    q: searchQuery || undefined,
  });

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [inviteTarget, setInviteTarget] = useState<{ id: string; name: string } | null>(null);

  // Toolbar is always visible – never unmount the search input
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <SearchInputURL placeholder="جستجوی پروژه..." className="flex-1" />
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="shadow-primary/20 gap-2 shadow-lg"
          aria-label="ایجاد پروژه جدید"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">پروژه جدید</span>
        </Button>
      </div>

      {/* Content area */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => window.location.reload()} />
      ) : projects.length === 0 && !searchQuery ? (
        <EmptyState
          icon={FolderKanban}
          title="پروژه‌ای یافت نشد"
          description="هنوز هیچ پروژه‌ای ایجاد نکرده‌اید"
          action={
            <Button
              onClick={() => setCreateOpen(true)}
              className="shadow-primary/20 gap-2 shadow-lg"
              aria-label="ایجاد پروژه جدید"
            >
              <Plus className="h-4 w-4" /> ایجاد اولین پروژه
            </Button>
          }
        />
      ) : searchQuery && projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="نتیجه‌ای یافت نشد"
          description={`پروژه‌ای با "${searchQuery}" پیدا نشد`}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
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
                  onDeleteRequest={setDeletingProjectId}
                  onInvite={(id) => {
                    const p = projects.find((proj) => proj.id === id);
                    if (p) setInviteTarget({ id, name: p.name });
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialogs */}
      <ProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editingProject && (
        <ProjectDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => {
            if (!open) setEditingProject(null);
          }}
        />
      )}
      <DeleteConfirmDialog
        open={!!deletingProjectId}
        onOpenChange={() => setDeletingProjectId(null)}
        title="حذف پروژه"
        description="از حذف این پروژه مطمئن هستید؟"
        onConfirm={() => {
          if (deletingProjectId) {
            deleteProject(deletingProjectId);
            setDeletingProjectId(null);
          }
        }}
        isDeleting={isDeleting}
      />
      {inviteTarget && (
        <InviteMemberDialog
          projectId={inviteTarget.id}
          projectName={inviteTarget.name}
          open={!!inviteTarget}
          onOpenChange={(open) => {
            if (!open) setInviteTarget(null);
          }}
        />
      )}
    </div>
  );
}

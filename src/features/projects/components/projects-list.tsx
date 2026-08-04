'use client';

import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Button } from '@/shared/components/ui/button';
import { SearchInput } from '@/shared/components/ui/search-input';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderKanban, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProjects } from '../hooks/use-projects';
import type { Project } from '../types';
import { InviteMemberDialog } from './invite-member-dialog';
import { ProjectCard } from './project-card';
import { ProjectCardSkeleton } from './project-card-skeleton';
import { ProjectDialog } from './project-dialog';

export function ProjectsList() {
  const { projects, isLoading, isError, deleteProject, isDeleting } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [inviteTarget, setInviteTarget] = useState<{ id: string; name: string } | null>(null);

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

  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="پروژه‌ای یافت نشد"
        description="هنوز هیچ پروژه‌ای ایجاد نکرده‌اید"
        action={
          <Button onClick={() => setCreateOpen(true)} className="shadow-primary/20 gap-2 shadow-lg">
            <Plus className="h-4 w-4" /> ایجاد اولین پروژه
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SearchInput placeholder="جستجوی پروژه..." onSearch={setSearchQuery} className="flex-1" />
        <Button onClick={() => setCreateOpen(true)} className="shadow-primary/20 gap-2 shadow-lg">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">پروژه جدید</span>
        </Button>
      </div>

      {searchQuery && filteredProjects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="نتیجه‌ای یافت نشد"
          description={`پروژه‌ای با "${searchQuery}" پیدا نشد`}
        />
      )}

      {filteredProjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
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
                    const p = projects.find((p) => p.id === id);
                    if (p) setInviteTarget({ id, name: p.name });
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Dialog */}
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

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deletingProjectId}
        onOpenChange={() => setDeletingProjectId(null)}
        title="حذف پروژه"
        description="از حذف این پروژه مطمئن هستید؟ تمام تسک‌ها و چت‌های مربوطه نیز حذف خواهند شد."
        onConfirm={() => {
          if (deletingProjectId) {
            deleteProject(deletingProjectId);
            setDeletingProjectId(null);
          }
        }}
        isDeleting={isDeleting}
      />

      {/* Invite Dialog */}
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

'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Button } from '@/shared/components/ui/button';
import { canMoveTasks } from '@/shared/lib/permissions';
import { AnimatePresence, motion } from 'framer-motion';
import { Columns, Plus } from 'lucide-react';
import { useCallback } from 'react';
import { useGlobalCommentListener } from '../hooks/use-global-comment-listener';
import { useKanbanBoard } from '../hooks/use-kanban-board';
import { useProjectMembers } from '../hooks/use-project-members';
import type { Task } from '../types';
import { KanbanBoardSkeleton } from './kanban-board-skeleton';
import { KanbanColumn } from './kanban-column';
import { KanbanToolbar } from './kanban-toolbar';
import { TaskCard } from './task-card';
import { TaskDetailSheet } from './task-detail-sheet';
import { TaskDialog } from './task-dialog';

export function KanbanBoard() {
  const {
    tasks,
    isLoading,
    isError,
    isDeleting,
    hasNoTasks,
    columns,
    projects,
    searchQuery,
    selectedProjectId,
    setSelectedProjectId,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    combinedSort,
    setCombinedSort,
    viewMode,
    setViewMode,
    draggedTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    createOpen,
    editingTask,
    deletingTaskId,
    viewingTask,
    openCreate,
    closeCreate,
    handleEdit,
    closeEdit,
    handleDeleteRequest,
    handleDeleteConfirm,
    closeDelete,
    handleView,
    closeView,
    clearFilters,
    handleDragEnd,
  } = useKanbanBoard();

  const { data: members = [] } = useProjectMembers(
    selectedProjectId !== 'all' ? selectedProjectId : undefined
  );

  const { user: currentUser } = useAuth();

  const currentProject =
    selectedProjectId !== 'all' ? projects.find((p) => p.id === selectedProjectId) : undefined;

  const userCanMoveTask = useCallback(
    (task: Task) => {
      if (!currentUser) return false;
      // When viewing all projects, allow drag for own tasks and assigned tasks
      if (!currentProject) {
        return (
          task.creatorId === currentUser.id ||
          task.assignees?.some((a) => a.userId === currentUser.id) ||
          false
        );
      }
      return canMoveTasks(currentUser, currentProject, task);
    },
    [currentProject, currentUser]
  );

  useGlobalCommentListener();

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <KanbanToolbar
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          combinedSort={combinedSort}
          setCombinedSort={setCombinedSort}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreateClick={openCreate}
          members={members}
          searchQuery={searchQuery}
          onClearFilters={clearFilters}
          user={currentUser}
        />

        {/* Content */}
        {isLoading ? (
          <KanbanBoardSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : hasNoTasks && !searchQuery ? (
          <EmptyState
            icon={Columns}
            title="تسکی وجود ندارد"
            description={
              selectedProjectId !== 'all' ? 'این پروژه تسکی ندارد' : 'هنوز هیچ تسکی ایجاد نشده'
            }
            action={
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" /> ایجاد اولین تسک
              </Button>
            }
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={Columns}
            title="نتیجه‌ای یافت نشد"
            description="تسکی با این مشخصات پیدا نشد"
          />
        ) : viewMode === 'kanban' ? (
          <div className="-mx-3 overflow-x-auto px-3 pb-4 md:mx-0 md:px-0">
            <div className="grid min-w-[320px] grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {columns.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(col.id as Task['status'])}
                  draggedTask={draggedTask}
                  onDragStart={handleDragStart}
                  onEditTask={handleEdit}
                  onDeleteTask={handleDeleteRequest}
                  onViewTask={handleView}
                  project={currentProject}
                  userCanMoveTask={userCanMoveTask}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <TaskCard
                    task={task}
                    onDragStart={handleDragStart}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                    onView={handleView}
                    project={currentProject}
                    onDragEnd={handleDragEnd}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <TaskDialog open={createOpen} onOpenChange={closeCreate} />
      <TaskDialog task={editingTask ?? undefined} open={!!editingTask} onOpenChange={closeEdit} />
      <DeleteConfirmDialog
        open={!!deletingTaskId}
        onOpenChange={closeDelete}
        title="حذف تسک"
        description="از حذف این تسک مطمئن هستید؟"
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      {viewingTask && (
        <TaskDetailSheet
          task={viewingTask}
          open={!!viewingTask}
          onOpenChange={closeView}
          currentUserId={currentUser?.id}
        />
      )}
    </>
  );
}

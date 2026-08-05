'use client';

import { useProjects } from '@/features/projects/hooks/use-projects';
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Button } from '@/shared/components/ui/button';
import { SearchInput } from '@/shared/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { Columns, List, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { KANBAN_COLUMNS } from '../constants';
import { useTaskDragDrop } from '../hooks/use-task-drag-drop';
import { useTasks } from '../hooks/use-tasks';
import type { Task } from '../types';
import { KanbanBoardSkeleton } from './kanban-board-skeleton';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { TaskDetailSheet } from './task-detail-sheet';
import { TaskDialog } from './task-dialog';

export function KanbanBoard() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, isLoading, isError, updateTask, deleteTask, isDeleting } = useTasks(
    selectedProjectId !== 'all' ? selectedProjectId : undefined
  );
  const { draggedTask, handleDragStart, handleDragOver, handleDrop } = useTaskDragDrop(
    (id, status) => updateTask({ id, data: { status } })
  );
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Filter tasks by search
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  const columns = useMemo(
    () =>
      KANBAN_COLUMNS.map((col) => ({
        ...col,
        tasks: filteredTasks.filter((t) => t.status === col.id),
      })),
    [filteredTasks]
  );

  const hasNoTasks = tasks.length === 0;

  if (isLoading) return <KanbanBoardSkeleton />;
  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar – Mobile First */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="h-9 w-35 rounded-lg text-xs">
                <SelectValue placeholder="همه پروژه‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه پروژه‌ها</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <SearchInput placeholder="جستجوی تسک..." onSearch={setSearchQuery} className="flex-1" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="bg-muted/50 flex items-center gap-1 rounded-xl p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-lg"
              >
                <Columns className="ml-2 h-4 w-4" />
                <span className="hidden sm:inline">کانبان</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-lg"
              >
                <List className="ml-2 h-4 w-4" />
                <span className="hidden sm:inline">لیست</span>
              </Button>
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              className="shadow-primary/20 gap-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">تسک جدید</span>
            </Button>
          </div>
        </div>
        {/* Board */}
        {hasNoTasks && !searchQuery ? (
          <EmptyState
            icon={Columns}
            title="تسکی وجود ندارد"
            description={
              selectedProjectId !== 'all' ? 'این پروژه تسکی ندارد' : 'هنوز هیچ تسکی ایجاد نشده'
            }
            action={
              <Button onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                ایجاد اولین تسک
              </Button>
            }
          />
        ) : filteredTasks.length === 0 ? (
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
                  onEditTask={setEditingTask}
                  onDeleteTask={setDeletingTaskId}
                  onViewTask={setViewingTask}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
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
                    onEdit={setEditingTask}
                    onDelete={setDeletingTaskId}
                    onView={setViewingTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        {/* Create Task Dialog */}
        <TaskDialog open={createOpen} onOpenChange={setCreateOpen} />
        {/* Edit Task Dialog */}
        <TaskDialog
          task={editingTask ?? undefined}
          open={!!editingTask}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
        />
        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          open={!!deletingTaskId}
          onOpenChange={() => setDeletingTaskId(null)}
          title="حذف تسک"
          description="از حذف این تسک مطمئن هستید؟"
          onConfirm={() => {
            if (deletingTaskId) {
              deleteTask(deletingTaskId);
              setDeletingTaskId(null);
            }
          }}
          isDeleting={isDeleting}
        />
      </div>
      {viewingTask && (
        <TaskDetailSheet
          task={viewingTask}
          open={!!viewingTask}
          onOpenChange={(open) => {
            if (!open) setViewingTask(null);
          }}
        />
      )}
    </>
  );
}

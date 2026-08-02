'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Button } from '@/shared/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Columns, List } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { KANBAN_COLUMNS } from '../constants';
import { useTasks } from '../hooks/use-tasks';
import type { Task } from '../types';
import { CreateTaskDialog } from './create-task-dialog';
import { KanbanBoardSkeleton } from './kanban-board-skeleton';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';

export function KanbanBoard() {
  const { tasks, isLoading, isError, updateTask } = useTasks();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const draggedTaskRef = useRef<Task | null>(null);

  const handleDragStart = useCallback((task: Task) => {
    draggedTaskRef.current = task;
    setDraggedTask(task);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  const handleDrop = useCallback(
    (status: Task['status']) => {
      const task = draggedTaskRef.current;
      if (task && task.status !== status) updateTask({ id: task.id, data: { status } });
      draggedTaskRef.current = null;
      setDraggedTask(null);
    },
    [updateTask]
  );

  // ✅ همه hooks قبل از early return
  const columns = useMemo(
    () =>
      KANBAN_COLUMNS.map((col) => ({ ...col, tasks: tasks.filter((t) => t.status === col.id) })),
    [tasks]
  );
  const hasNoTasks = useMemo(() => columns.every((col) => col.tasks.length === 0), [columns]);

  if (isLoading) return <KanbanBoardSkeleton />;
  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;

  if (hasNoTasks) {
    return (
      <EmptyState
        icon={Columns}
        title="تسکی وجود ندارد"
        description="هنوز هیچ تسکی ایجاد نشده. اولین تسک خود را بسازید!"
        action={<CreateTaskDialog />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-1">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            className="rounded-lg"
          >
            <Columns className="ml-2 h-4 w-4" />
            کانبان
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-lg"
          >
            <List className="ml-2 h-4 w-4" />
            لیست
          </Button>
        </div>
        <CreateTaskDialog />
      </div>

      {viewMode === 'kanban' ? (
        <div className="-mx-3 overflow-x-auto px-3 pb-4 md:mx-0 md:px-0">
          <div className="grid min-w-[320px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id as Task['status'])}
                draggedTask={draggedTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task: Task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <TaskCard task={task} onDragStart={handleDragStart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

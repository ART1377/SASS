'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { LoadingSkeleton } from '@/shared/components/loading-skeleton';
import { Button } from '@/shared/components/ui/button';
import { Columns, List } from 'lucide-react';
import { useCallback, useState } from 'react';
import { KANBAN_COLUMNS } from '../constants';
import { useTasks } from '../hooks/use-tasks';
import type { Task } from '../types';
import { CreateTaskDialog } from './create-task-dialog';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';

export function KanbanBoard() {
  const { tasks, isLoading, isError, updateTask } = useTasks();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = useCallback((task: Task) => {
    setDraggedTask(task);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (status: Task['status']) => {
      if (draggedTask && draggedTask.status !== status) {
        updateTask({
          id: draggedTask.id,
          data: { status },
        });
      }
      setDraggedTask(null);
    },
    [draggedTask, updateTask]
  );

  if (isLoading) return <LoadingSkeleton type="kanban" count={3} />;
  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;

  const columns = KANBAN_COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((task: Task) => task.status === col.id),
  }));

  const hasNoTasks = columns.every((col) => col.tasks.length === 0);

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
      {/* Header Actions */}
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

      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="-mx-3 overflow-x-auto px-3 pb-4 md:mx-0 md:px-0">
          <div className="grid min-w-[320px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id as Task['status'])}
                draggedTask={draggedTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
          ))}
        </div>
      )}
    </div>
  );
}

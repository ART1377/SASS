'use client';

import { cn } from '@/shared/lib/utils';
import type { Task } from '../types';
import { TaskCard } from './task-card';

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
    borderColor: string;
    tasks: Task[];
  };
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  draggedTask: Task | null;
  onDragStart: (task: Task) => void;
}

export function KanbanColumn({
  column,
  onDragOver,
  onDrop,
  draggedTask,
  onDragStart,
}: KanbanColumnProps) {
  const isTarget = draggedTask && draggedTask.status !== column.id;

  return (
    <div
      className={cn(
        'bg-muted/30 flex flex-col rounded-2xl border-2 border-dashed border-transparent p-3 transition-all duration-300',
        isTarget && 'border-primary/30 bg-primary/5'
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Column Header */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <div className={cn('h-3 w-3 rounded-full', column.color)} />
        <h3 className="text-foreground text-sm font-semibold">{column.title}</h3>
        <span className="bg-muted text-muted-foreground ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
          {column.tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex min-h-50 flex-col gap-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}

        {column.tasks.length === 0 && (
          <div className="border-border/50 flex flex-1 items-center justify-center rounded-xl border border-dashed p-8">
            <p className="text-muted-foreground text-xs">تسکی وجود ندارد</p>
          </div>
        )}
      </div>
    </div>
  );
}

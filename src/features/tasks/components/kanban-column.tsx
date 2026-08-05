'use client';

import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
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
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onViewTask?: (task: Task) => void; // ← NEW
}

export function KanbanColumn({
  column,
  onDragOver,
  onDrop,
  draggedTask,
  onDragStart,
  onEditTask,
  onDeleteTask,
  onViewTask, // ← NEW
}: KanbanColumnProps) {
  const isTarget = draggedTask && draggedTask.status !== column.id;

  return (
    <div
      role="region"
      aria-label={column.title}
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

      {/* Tasks with Animation */}
      <div className="flex min-h-50 flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {column.tasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-border/50 flex flex-1 items-center justify-center rounded-xl border border-dashed p-8"
            >
              <p className="text-muted-foreground text-xs">تسکی وجود ندارد</p>
            </motion.div>
          ) : (
            column.tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <TaskCard
                  task={task}
                  onDragStart={onDragStart}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onView={onViewTask}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

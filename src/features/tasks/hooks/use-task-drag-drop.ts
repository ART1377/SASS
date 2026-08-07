'use client';

import { useCallback, useRef, useState } from 'react';
import type { Task } from '../types';

export function useTaskDragDrop(onUpdateTask: (id: string, status: Task['status']) => void) {
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
      if (task && task.status !== status) {
        onUpdateTask(task.id, status);
      }
      // Always clear drag state, even if dropped on same column
      draggedTaskRef.current = null;
      setDraggedTask(null);
    },
    [onUpdateTask]
  );

  // Add drag end handler to clear state when drag is cancelled
  const handleDragEnd = useCallback(() => {
    draggedTaskRef.current = null;
    setDraggedTask(null);
  }, []);

  return { draggedTask, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
}

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
      draggedTaskRef.current = null;
      setDraggedTask(null);
    },
    [onUpdateTask]
  );

  return { draggedTask, handleDragStart, handleDragOver, handleDrop };
}

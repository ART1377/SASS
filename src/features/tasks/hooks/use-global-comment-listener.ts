'use client';

import { useSocket } from '@/shared/providers/socket-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Task, TaskComment } from '../types';

/**
 * Listens for comment:new socket events globally and updates
 * task comment counts in the cache, regardless of which sheet is open.
 * Mount this once at the kanban board level.
 */
export function useGlobalCommentListener() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleComment = (data: { taskId: string; comment: TaskComment }) => {
      // Update comment count on the task card across all task queries
      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'], exact: false }, (old) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === data.taskId
            ? {
                ...task,
                _count: {
                  ...task._count,
                  comments: (task._count?.comments ?? 0) + 1,
                },
              }
            : task
        );
      });
    };

    socket.on('comment:new', handleComment);
    return () => {
      socket.off('comment:new', handleComment);
    };
  }, [socket, queryClient]);
}

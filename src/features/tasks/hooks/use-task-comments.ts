'use client';

import { queryKeys } from '@/shared/lib/query-keys';
import { useSocket } from '@/shared/providers/socket-provider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { tasksApi } from '../api/tasks-api';
import { TaskComment } from '../types';

export function useTaskComments(taskId: string, enabled: boolean) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const commentsQuery = useQuery({
    queryKey: queryKeys.tasks.comments(taskId),
    queryFn: () => tasksApi.getComments(taskId),
    enabled,
  });

  // Send comment via Socket (primary path)
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!socket || !isConnected) {
          reject(new Error('اتصال برقرار نیست'));
          return;
        }
        socket.emit('comment:add', { taskId, content });
        resolve();
      });
    },
  });

  // Listen for real‑time comments
  useEffect(() => {
    if (!socket) return;

    const handleComment = (data: { taskId: string; comment: TaskComment }) => {
      if (data.taskId !== taskId) return;

      queryClient.setQueryData<TaskComment[]>(queryKeys.tasks.comments(taskId), (old) => {
        if (!old) return [data.comment];
        if (old.some((c) => c.id === data.comment.id)) return old;
        return [...old, data.comment];
      });
    };

    socket.on('comment:new', handleComment);
    return () => {
      socket.off('comment:new', handleComment);
    };
  }, [socket, taskId, queryClient]);

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
  };
}

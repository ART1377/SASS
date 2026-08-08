'use client';

import { queryKeys } from '@/shared/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { tasksApi } from '../api/tasks-api';
import type { TaskComment } from '../types';

export function useTaskComments(taskId: string, enabled: boolean) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const commentsQuery = useQuery({
    queryKey: queryKeys.tasks.comments(taskId),
    queryFn: () => tasksApi.getComments(taskId),
    enabled,
    staleTime: 0,
    refetchOnMount: true,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      // Send comment via REST API (server will broadcast via Pusher)
      await tasksApi.addComment(taskId, content);
    },
  });

  // Listen for real‑time comments via Pusher
  useEffect(() => {
    if (!enabled || !session?.user?.id) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`project-${taskId}`);

    const handleComment = (data: { taskId: string; comment: TaskComment }) => {
      if (data.taskId !== taskId) return;

      queryClient.setQueryData<TaskComment[]>(queryKeys.tasks.comments(taskId), (old) => {
        if (!old) return [data.comment];
        if (old.some((c) => c.id === data.comment.id)) return old;
        return [...old, data.comment];
      });
    };

    channel.bind('comment:new', handleComment);

    return () => {
      channel.unbind('comment:new', handleComment);
      pusher.unsubscribe(`project-${taskId}`);
      pusher.disconnect();
    };
  }, [taskId, enabled, queryClient, session?.user?.id]);

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
  };
}

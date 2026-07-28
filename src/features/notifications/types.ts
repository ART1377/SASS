export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'COMMENT_ADDED' | 'PROJECT_INVITE' | 'MENTION';
  isRead: boolean;
  createdAt: string;
  metadata?: {
    projectId?: string;
    taskId?: string;
    commentId?: string;
  };
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

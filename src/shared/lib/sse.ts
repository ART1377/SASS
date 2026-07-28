interface SSENotification {
  userId: string;
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'COMMENT_ADDED' | 'PROJECT_INVITE' | 'MENTION';
  title: string;
  message: string;
  data?: Record<string, string>;
}

/**
 * Send a real-time notification to a specific user via SSE
 */
export function sendSSENotification(notification: SSENotification) {
  if (!globalThis.sseClients) return;

  const payload = JSON.stringify({
    type: 'notification',
    notification: {
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: new Date().toISOString(),
    },
  });

  // Send to all connected clients of this user
  globalThis.sseClients.forEach((client) => {
    if (client.userId === notification.userId) {
      try {
        client.controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
      } catch {
        // Client disconnected, will be cleaned up on next heartbeat
      }
    }
  });
}

/**
 * Send a notification to all members of a project
 */
export function sendProjectNotification(
  projectId: string,
  excludeUserId: string,
  notification: Omit<SSENotification, 'userId'>
) {
  if (!globalThis.sseClients) return;

  const payload = JSON.stringify({
    type: 'notification',
    notification: {
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: new Date().toISOString(),
    },
  });

  // We need to know which users are in this project
  // This will be called after we fetch project members
  // For now, we'll pass the userIds directly

  globalThis.sseClients.forEach((client) => {
    if (client.userId !== excludeUserId) {
      try {
        client.controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
      } catch {
        // Client disconnected
      }
    }
  });
}

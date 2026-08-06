import { apiClient } from '@/shared/config/axios';
import type { CreateTaskInput, Task, TaskComment, UpdateTaskInput } from '../types';

export const tasksApi = {
  getAll: async (params?: {
    projectId?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    q?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskInput): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  // ---------- Comments ----------
  getComments: async (taskId: string): Promise<TaskComment[]> => {
    const response = await apiClient.get<TaskComment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  },

  addComment: async (taskId: string, content: string): Promise<TaskComment> => {
    const response = await apiClient.post<TaskComment>(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },
};

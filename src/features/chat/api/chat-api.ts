import { apiClient } from '@/shared/config/axios';
import type { ChatMessage, ChatRoom } from '../types';

export const chatApi = {
  getRooms: async (projectId?: string): Promise<ChatRoom[]> => {
    const response = await apiClient.get<ChatRoom[]>('/chat/rooms', {
      params: projectId ? { projectId } : undefined,
    });
    return response.data;
  },

  getMessages: async (roomId: string, limit = 50): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`, {
      params: { limit },
    });
    return response.data;
  },

  sendMessage: async (roomId: string, content: string): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
      content,
    });
    return response.data;
  },

  createRoom: async (projectId: string, name: string): Promise<ChatRoom> => {
    const response = await apiClient.post<ChatRoom>('/chat/rooms', {
      projectId,
      name,
      type: 'GROUP',
    });
    return response.data;
  },
};

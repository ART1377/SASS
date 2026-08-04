import { apiClient } from '@/shared/config/axios';
import { MESSAGES_PAGE_SIZE } from '../constants';
import type { ChatMessage, ChatRoom } from '../types';

export interface MessagesPage {
  messages: ChatMessage[];
  nextCursor: string | null;
}

export const chatApi = {
  getRooms: async (projectId?: string): Promise<ChatRoom[]> => {
    const response = await apiClient.get<ChatRoom[]>('/chat/rooms', {
      params: projectId ? { projectId } : undefined,
    });
    return response.data;
  },

  getMessages: async (
    roomId: string,
    before?: string,
    limit = MESSAGES_PAGE_SIZE
  ): Promise<MessagesPage> => {
    const response = await apiClient.get<MessagesPage>(`/chat/rooms/${roomId}/messages`, {
      params: { limit, before },
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

  /** Send a message via REST (used for forwarding and fallback). */
  sendMessage: async (
    roomId: string,
    content: string,
    replyToId?: string
  ): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
      content,
      replyToId: replyToId || undefined,
    });
    return response.data;
  },

  deleteMessage: async (roomId: string, messageId: string): Promise<void> => {
    await apiClient.delete(`/chat/rooms/${roomId}/messages/${messageId}`);
  },

  updateMessage: async (
    roomId: string,
    messageId: string,
    content: string
  ): Promise<ChatMessage> => {
    const response = await apiClient.patch<ChatMessage>(
      `/chat/rooms/${roomId}/messages/${messageId}`,
      { content }
    );
    return response.data;
  },
};

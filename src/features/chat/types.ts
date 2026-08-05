export interface ChatRoom {
  id: string;
  projectId: string;
  name: string;
  type: 'GROUP' | 'DIRECT';
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
  };
  _count?: {
    messages: number;
    members: number;
  };
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export interface ReplyInfo {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
}

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  replyToId?: string | null;
  replyTo?: ReplyInfo | null;
  createdAt: string;
  editedAt?: string | null;
  /** Original author's name, set only on forwarded messages. Content itself is never mutated. */
  forwardedFromName?: string | null;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
  /** Client-only fields, never persisted */
  clientId?: string;
  status?: MessageStatus;
}

export interface MessageGroup {
  senderId: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
  messages: ChatMessage[];
  isOwn: boolean;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

export interface ChatMember {
  id: string;
  roomId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  isOnline?: boolean;
  isTyping?: boolean;
}

export interface SocketMessage extends ChatMessage {
  clientId?: string;
}

export interface RoomUpdatedPayload {
  roomId: string;
  lastMessage: ChatMessage;
  isSender: boolean;
}

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

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
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

export interface SocketMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

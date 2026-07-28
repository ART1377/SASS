'use client';

import { useChat } from '../hooks/use-chat';
import type { ChatRoom } from '../types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

export function ChatRoomView({ chatRoom }: { chatRoom: ChatRoom }) {
  const {
    messages,
    isLoading,
    sendMessage,
    isSending,
    typingUsers,
    startTyping,
    stopTyping,
    currentUser,
  } = useChat(chatRoom.id);

  return (
    <>
      <ChatMessages
        messages={messages}
        currentUserId={currentUser?.id || ''}
        isLoading={isLoading}
        typingUsers={typingUsers}
      />
      <ChatInput
        onSend={sendMessage}
        isSending={isSending}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
      />
    </>
  );
}

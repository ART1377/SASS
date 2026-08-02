'use client';

import { ErrorState } from '@/shared/components/error-state';
import { Hash, Users } from 'lucide-react';
import { useChat } from '../hooks/use-chat';
import type { ChatRoom } from '../types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

export function ChatRoomView({ chatRoom }: { chatRoom: ChatRoom }) {
  const {
    messages,
    isLoading,
    isError,
    sendMessage,
    isSending,
    typingUsers,
    startTyping,
    stopTyping,
    currentUser,
    refetch,
    onlineCount,
  } = useChat(chatRoom.id);

  if (isError) {
    return (
      <ErrorState
        title="خطا در بارگذاری پیام‌ها"
        message="مشکلی در دریافت پیام‌ها پیش آمده است"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      {/* Header Info */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl">
          {chatRoom.type === 'GROUP' ? (
            <Users className="text-primary h-4 w-4" />
          ) : (
            <Hash className="text-primary h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{chatRoom.name}</h3>
          <p className="text-muted-foreground text-xs">
            {chatRoom._count?.members ?? 0} عضو • {onlineCount} آنلاین
          </p>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        currentUserId={currentUser?.id || ''}
        isLoading={isLoading}
        typingUsers={typingUsers}
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isSending={isSending}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
      />
    </>
  );
}

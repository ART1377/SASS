'use client';

import { ErrorState } from '@/shared/components/error-state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { AnimatePresence } from 'framer-motion';
import { Hash, Users } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useChat } from '../hooks/use-chat';
import type { ChatRoom, ReplyInfo } from '../types';
import { ChatInput, type ChatInputHandle } from './chat-input';
import { ChatMessages } from './chat-messages';
import { ReplyPreview } from './reply-preview';

export function ChatRoomView({ chatRoom }: { chatRoom: ChatRoom }) {
  const {
    messages,
    isLoading,
    isError,
    sendMessage,
    retryMessage,
    typingUsers,
    startTyping,
    stopTyping,
    currentUser,
    refetch,
    onlineCount,
    deleteMessage,
    updateMessage,
    hasOlderMessages,
    isLoadingOlder,
    loadOlderMessages,
  } = useChat(chatRoom.id);

  const chatInputRef = useRef<ChatInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyInfo | null>(null);
  const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleEdit = useCallback((messageId: string, content: string) => {
    setEditingMessage({ id: messageId, content });
  }, []);

  const handleDeleteRequest = useCallback((messageId: string) => {
    setDeleteTarget(messageId);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      deleteMessage(deleteTarget);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteMessage]);

  const handleReply = useCallback((message: ReplyInfo) => {
    setReplyTo(message);
    chatInputRef.current?.focus();
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      if (editingMessage) {
        updateMessage(editingMessage.id, content);
        setEditingMessage(null);
      } else {
        sendMessage(content, replyTo || undefined);
      }
      setReplyTo(null);
    },
    [sendMessage, replyTo, editingMessage, updateMessage]
  );

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

      <AnimatePresence>
        {replyTo && (
          <ReplyPreview
            replyTo={replyTo}
            onClear={() => setReplyTo(null)}
            onClick={() => setScrollToMessageId(replyTo.id)}
          />
        )}
      </AnimatePresence>

      <ChatMessages
        messages={messages}
        currentUserId={currentUser?.id || ''}
        isLoading={isLoading}
        typingUsers={typingUsers}
        onReply={handleReply}
        scrollToMessageId={scrollToMessageId}
        onReplyClick={(messageId) => setScrollToMessageId(messageId)}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onRetry={retryMessage}
        hasOlderMessages={hasOlderMessages}
        isLoadingOlder={isLoadingOlder}
        onLoadOlder={loadOlderMessages}
      />

      <ChatInput
        ref={chatInputRef}
        onSend={handleSend}
        isSending={false}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
        editMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف پیام</AlertDialogTitle>
            <AlertDialogDescription>
              از حذف این پیام مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

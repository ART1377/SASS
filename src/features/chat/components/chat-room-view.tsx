'use client';

import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { ErrorState } from '@/shared/components/error-state';
import { Button } from '@/shared/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { CheckSquare, Hash, Trash2, Users } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useChat } from '../hooks/use-chat';
import type { ChatRoom, ReplyInfo } from '../types';
import { ChatInput, type ChatInputHandle } from './chat-input';
import { ChatMessages } from './chat-messages';
import { ForwardDialog } from './forward-dialog';
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
    deleteMessageWithToast,
    bulkDeleteMessagesWithToast,
    forwardMessagesWithToast,
    copyMessageWithToast,
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

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [forwardOpen, setForwardOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleEdit = useCallback((messageId: string, content: string) => {
    setEditingMessage({ id: messageId, content });
  }, []);

  const handleDeleteRequest = useCallback((messageId: string) => {
    setDeleteTarget(messageId);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    deleteMessageWithToast(target);
  }, [deleteTarget, deleteMessageWithToast]);

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

  const toggleSelect = useCallback((messageId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
        if (next.size === 0) setSelectMode(false);
      } else {
        next.add(messageId);
      }
      return next;
    });
  }, []);

  const enterSelectMode = useCallback((messageId?: string) => {
    setSelectMode(true);
    if (messageId) setSelectedIds(new Set([messageId]));
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleForward = useCallback(
    (targetRoomId: string) => {
      if (selectedIds.size === 0) return;
      const msgsToForward = messages.filter((m) => selectedIds.has(m.id));
      forwardMessagesWithToast(targetRoomId, msgsToForward);
      exitSelectMode();
    },
    [selectedIds, messages, exitSelectMode, forwardMessagesWithToast]
  );

  const handleBulkDeleteConfirm = useCallback(() => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    setBulkDeleteOpen(false);
    exitSelectMode();
    bulkDeleteMessagesWithToast(ids);
  }, [selectedIds, bulkDeleteMessagesWithToast, exitSelectMode]);

  const handleReplyClick = useCallback((messageId: string) => {
    setScrollToMessageId(null);
    setTimeout(() => setScrollToMessageId(messageId), 0);
  }, []);

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

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectMode((prev) => !prev)}
          aria-label="انتخاب پیام"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
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
        onReplyClick={(messageId) => handleReplyClick(messageId)}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onRetry={retryMessage}
        hasOlderMessages={hasOlderMessages}
        isLoadingOlder={isLoadingOlder}
        onLoadOlder={loadOlderMessages}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onLongPress={enterSelectMode}
        onCopy={copyMessageWithToast}
      />

      {selectMode ? (
        <div className="bg-background flex items-center gap-3 border-t px-4 py-3">
          <Button variant="ghost" size="sm" onClick={exitSelectMode}>
            لغو
          </Button>
          <span className="text-muted-foreground flex-1 text-center text-sm">
            {selectedIds.size} انتخاب شده
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBulkDeleteOpen(true)}
            disabled={selectedIds.size === 0}
          >
            <Trash2 className="ml-2 h-4 w-4" />
            حذف
          </Button>
          <Button size="sm" onClick={() => setForwardOpen(true)} disabled={selectedIds.size === 0}>
            <CheckSquare className="ml-2 h-4 w-4" />
            ارسال
          </Button>
        </div>
      ) : (
        <ChatInput
          ref={chatInputRef}
          onSend={handleSend}
          isSending={false}
          onStartTyping={startTyping}
          onStopTyping={stopTyping}
          editMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
        />
      )}

      <ForwardDialog
        open={forwardOpen}
        onOpenChange={setForwardOpen}
        onForward={handleForward}
        count={selectedIds.size}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="حذف پیام"
        description="از حذف این پیام مطمئن هستید؟ این عمل قابل بازگشت نیست."
        onConfirm={handleDeleteConfirm}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="حذف پیام‌ها"
        description={`از حذف ${selectedIds.size} پیام انتخاب شده مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleBulkDeleteConfirm}
      />
    </>
  );
}

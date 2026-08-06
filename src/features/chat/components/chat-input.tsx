'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Send, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MAX_MESSAGE_LENGTH, TYPING_TIMEOUT_MS } from '../constants';

const MIN_HEIGHT = 36;
const MAX_HEIGHT = 120;

interface Props {
  onSend: (content: string) => void;
  isSending: boolean;
  onStartTyping: () => void;
  onStopTyping: () => void;
  editMessage?: { id: string; content: string } | null;
  onCancelEdit?: () => void;
}

export interface ChatInputHandle {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputHandle, Props>(function ChatInput(
  { onSend, isSending, onStartTyping, onStopTyping, editMessage, onCancelEdit },
  ref
) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout>>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  useEffect(() => {
    if (editMessage) {
      setValue(editMessage.content);
      textareaRef.current?.focus();
    }
  }, [editMessage]);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = `${MIN_HEIGHT}px`;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
  }, []);

  useEffect(() => adjustHeight(), [value, adjustHeight]);

  const send = useCallback(() => {
    const content = value.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return;
    onSend(content);
    setValue('');
    onStopTyping();
    onCancelEdit?.();
    if (textareaRef.current) textareaRef.current.style.height = `${MIN_HEIGHT}px`;
    textareaRef.current?.focus();
  }, [value, onSend, onStopTyping, onCancelEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onStartTyping();
    clearTimeout(typingRef.current!);
    typingRef.current = setTimeout(onStopTyping, TYPING_TIMEOUT_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // On touch devices Enter should insert a newline, not send — mobile
    // users don't have a discoverable Shift key equivalent.
    const isTouchDevice =
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (e.key === 'Enter' && !e.shiftKey && !isTouchDevice) {
      e.preventDefault();
      send();
    }
    if (e.key === 'Escape' && editMessage) {
      setValue('');
      onCancelEdit?.();
    }
  };

  useEffect(() => () => clearTimeout(typingRef.current!), []);

  const canSend = value.trim().length > 0 && !isSending && value.length <= MAX_MESSAGE_LENGTH;
  const isNearLimit = value.length > MAX_MESSAGE_LENGTH * 0.8;
  const isOverLimit = value.length > MAX_MESSAGE_LENGTH;

  return (
    <div className="bg-background border-t">
      <AnimatePresence>
        {editMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary/5 dark:bg-primary/10 flex items-center gap-2 border-b px-4 py-2"
          >
            <Pencil className="text-primary h-3.5 w-3.5 shrink-0" />
            <span className="text-muted-foreground flex-1 truncate text-xs">
              ویرایش: {editMessage.content}
            </span>
            <button
              onClick={() => {
                setValue('');
                onCancelEdit?.();
              }}
              aria-label="لغو ویرایش"
              className="hover:bg-muted cursor-pointer rounded-lg p-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3">
        <div className="bg-muted/40 focus-within:bg-muted/60 focus-within:ring-primary/20 flex items-end gap-2 rounded-2xl p-1.5 transition-all focus-within:ring-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="پیام خود را بنویسید..."
            rows={1}
            disabled={isSending}
            aria-label="پیام"
            className="placeholder:text-muted-foreground/50 dark:placeholder:text-muted-foreground/60 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed focus:outline-none disabled:opacity-50"
            style={{ height: MIN_HEIGHT, minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
          />
          <motion.div
            initial={false}
            animate={canSend ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <Button
              onClick={send}
              disabled={!canSend}
              size="icon"
              aria-label="ارسال پیام"
              className="h-9 w-9 rounded-xl shadow-none"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isNearLimit && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn(
                'mt-1 px-2 text-[10px]',
                isOverLimit ? 'text-destructive font-medium' : 'text-muted-foreground'
              )}
            >
              {value.length} / {MAX_MESSAGE_LENGTH}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

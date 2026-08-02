'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_LENGTH = 1000;
const MIN_HEIGHT = 44;
const MAX_HEIGHT = 120;

interface Props {
  onSend: (content: string) => void;
  isSending: boolean;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

export function ChatInput({ onSend, isSending, onStartTyping, onStopTyping }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Auto-resize
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = `${MIN_HEIGHT}px`;
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Send message
  const send = useCallback(() => {
    const content = value.trim();
    if (!content || isSending || content.length > MAX_LENGTH) return;
    onSend(content);
    setValue('');
    onStopTyping();
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_HEIGHT}px`;
    }
    textareaRef.current?.focus();
  }, [value, isSending, onSend, onStopTyping]);

  // Handle typing indicator
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onStartTyping();
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(onStopTyping, 1500);
  };

  // Keyboard handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  const isOverLimit = value.length > MAX_LENGTH;
  const isNearLimit = value.length > MAX_LENGTH * 0.8;

  return (
    <div className="bg-background border-t p-3">
      <div
        className={cn(
          'bg-muted/40 focus-within:bg-muted/60 flex items-end gap-2 rounded-2xl p-1.5 transition-all',
          'focus-within:ring-primary/20 focus-within:ring-1'
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را بنویسید..."
          rows={1}
          disabled={isSending}
          className={cn(
            'placeholder:text-muted-foreground/50 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm',
            'focus:outline-none disabled:opacity-50'
          )}
          style={{ height: MIN_HEIGHT }}
        />

        <motion.div
          initial={false}
          animate={value.trim() ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Button
            onClick={send}
            disabled={!value.trim() || isSending || isOverLimit}
            size="icon"
            className="h-9 w-9 shrink-0 rounded-xl shadow-none"
          >
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Character counter */}
      <AnimatePresence>
        {isNearLimit && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={cn(
              'mt-1 px-2 text-[10px]',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {value.length} / {MAX_LENGTH}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { Button } from '@/shared/components/ui/button';
import { Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  onSend: (content: string) => void;
  isSending: boolean;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

export function ChatInput({ onSend, isSending, onStartTyping, onStopTyping }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = useCallback(() => {
    const content = value.trim();
    if (!content || isSending) return;
    onSend(content);
    setValue('');
    onStopTyping();
    inputRef.current?.focus();
  }, [value, isSending, onSend, onStopTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onStartTyping();
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(onStopTyping, 1500);
  };

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

  return (
    <div className="bg-background border-t p-3">
      <div className="bg-muted/40 focus-within:bg-muted/60 focus-within:ring-primary/20 flex items-end gap-2 rounded-2xl p-1.5 transition-all focus-within:ring-1">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را بنویسید..."
          rows={1}
          disabled={isSending}
          className="placeholder:text-muted-foreground/50 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm focus:outline-none disabled:opacity-50"
        />
        <Button
          onClick={send}
          disabled={!value.trim() || isSending}
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl shadow-none"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

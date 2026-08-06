'use client';

import { OnlineBadge } from '@/shared/components/online-badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { formatDateTime, getInitials } from '@/shared/lib/utils';
import { usePresence } from '@/shared/providers/presence-provider'; // ← import
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '../constants';
import { useTaskComments } from '../hooks/use-task-comments';
import type { Task } from '../types';

interface TaskDetailSheetProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailSheet({ task, open, onOpenChange }: TaskDetailSheetProps) {
  const [newComment, setNewComment] = useState('');
  const { comments, isLoading, addComment, isAddingComment } = useTaskComments(task.id, open);
  const { isUserOnline } = usePresence(); // ← add

  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto‑scroll to bottom whenever comments change or the sheet opens
  useEffect(() => {
    if (open && comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length, open]);

  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed || isAddingComment) return;
    addComment(trimmed);
    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-120">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-base font-semibold">{task.title}</SheetTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={task.priority}
              label={TASK_PRIORITY_LABELS[task.priority]}
              variant="dot"
              size="xs"
            />
            <Badge variant="secondary" className="text-[10px]">
              {TASK_STATUS_LABELS[task.status]}
            </Badge>
            {task.dueDate && (
              <span className="text-muted-foreground text-[10px]">
                موعد: {new Date(task.dueDate).toLocaleDateString('fa-IR')}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-muted-foreground mt-2 text-sm">{task.description}</p>
          )}
          {task.assignee && (
            <div className="mt-3 flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[9px]">
                    {getInitials(task.assignee.name)}
                  </AvatarFallback>
                </Avatar>
                <OnlineBadge isOnline={isUserOnline(task.assignee.id)} /> {/* ← real */}
              </div>
              <span className="text-muted-foreground text-xs">
                واگذار شده به {task.assignee.name}
              </span>
            </div>
          )}
        </SheetHeader>

        {/* Comments section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h4 className="mb-3 text-sm font-medium">نظرات</h4>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-xs">هنوز نظری ثبت نشده</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="relative h-fit">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                        {getInitials(comment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <OnlineBadge isOnline={isUserOnline(comment.user.id)} /> {/* ← real */}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <span className="text-muted-foreground text-[10px]">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>

        {/* Add comment input */}
        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="نظر خود را بنویسید..."
              rows={2}
              className="resize-none text-sm"
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isAddingComment}
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl"
            >
              {isAddingComment ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

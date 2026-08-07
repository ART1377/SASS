'use client';

import { ActionDropdown } from '@/shared/components/action-dropdown';
import { OnlineBadge } from '@/shared/components/online-badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { getInitials } from '@/shared/lib/utils';
import { usePresence } from '@/shared/providers/presence-provider';
import { Calendar, GripVertical, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import { TASK_PRIORITY_LABELS } from '../constants';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onView?: (task: Task) => void;
}

export const TaskCard = memo(function TaskCard({
  task,
  onDragStart,
  onEdit,
  onDelete,
  onView,
}: TaskCardProps) {
  const actions = [
    { label: 'ویرایش', icon: Pencil, onClick: () => onEdit?.(task) },
    { label: 'حذف', icon: Trash2, onClick: () => onDelete?.(task.id), destructive: true },
  ];
  const { isUserOnline } = usePresence();

  const handleCardClick = useCallback(() => {
    onView?.(task);
  }, [onView, task]);

  const handleGripDragStart = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      onDragStart(task);
    },
    [onDragStart, task]
  );

  return (
    <Card
      draggable
      role="button"
      tabIndex={0}
      aria-label={`مشاهده جزئیات تسک: ${task.title}`}
      onDragStart={handleGripDragStart}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleCardClick();
      }}
      className="card-hover group border-border/50 bg-card dark:border-border/30 dark:bg-card/80 dark:hover:border-border/50 focus:ring-ring focus:ring-offset-background relative cursor-pointer border shadow-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none active:cursor-grabbing"
    >
      {/* Gradient overlay on hover */}
      <div className="from-primary/5 pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="space-y-2 p-3">
        {/* Header Row: Drag Handle + Title + Menu */}
        <div className="flex items-start gap-2">
          {/* Grip – only for dragging */}
          <div
            draggable
            onDragStart={handleGripDragStart}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground/40 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium">{task.title}</p>
          </div>

          {/* Three‑dot menu – stop propagation so it doesn't open the sheet */}
          <div onClick={(e) => e.stopPropagation()}>
            <ActionDropdown items={actions} />
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={task.priority}
            label={TASK_PRIORITY_LABELS[task.priority]}
            variant="dot"
            size="xs"
          />
          {task.dueDate && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString('fa-IR')}
            </Badge>
          )}
        </div>

        {/* Footer Row: Comments + Assignees */}
        <div className="border-border/40 flex items-center justify-between border-t pt-1.5">
          <div className="text-muted-foreground/70 flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3" />
            {task._count?.comments ?? 0}
          </div>
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {task.assignees.slice(0, 3).map((assignee) => (
                <div key={assignee.userId} className="relative">
                  <Avatar className="ring-border h-6 w-6 ring-2">
                    <AvatarFallback className="bg-primary/10 text-primary text-[9px]">
                      {getInitials(assignee.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <OnlineBadge isOnline={isUserOnline(assignee.userId)} />
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="bg-muted ring-border flex h-6 w-6 items-center justify-center rounded-full text-[9px] ring-2">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

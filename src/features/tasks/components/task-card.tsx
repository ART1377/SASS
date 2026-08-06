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

  // Open detail sheet on card click
  const handleCardClick = useCallback(() => {
    onView?.(task);
  }, [onView, task]);

  // Prevent card click when interacting with grip or dropdown
  const handleGripDragStart = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation(); // don't trigger card click
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
      className="card-hover group relative cursor-pointer border-0 shadow-md transition-all duration-200 active:cursor-grabbing"
    >
      <CardContent className="space-y-2 p-3">
        {/* Header Row: Drag Handle + Title + Menu */}
        <div className="flex items-start gap-2">
          {/* Grip – only for dragging */}
          <div
            draggable
            onDragStart={handleGripDragStart}
            onClick={(e) => e.stopPropagation()} // prevent card click
            className="mt-1 shrink-0 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground/30 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
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

        {/* Footer Row: Comments + Assignee */}
        <div className="border-border/50 flex items-center justify-between border-t pt-1">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3" />
            {task._count?.comments ?? 0}
          </div>
          {task.assignee && (
            <div className="relative">
              <Avatar className="ring-border h-6 w-6 ring-2">
                <AvatarFallback className="bg-primary/10 text-primary text-[9px]">
                  {getInitials(task.assignee.name)}
                </AvatarFallback>
              </Avatar>
              <OnlineBadge isOnline={isUserOnline(task.assignee.id)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

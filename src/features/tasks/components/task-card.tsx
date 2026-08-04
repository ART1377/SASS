'use client';

import { ActionDropdown } from '@/shared/components/action-dropdown';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { getInitials } from '@/shared/lib/utils';
import { Calendar, GripVertical, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { TASK_PRIORITY_LABELS } from '../constants';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = memo(function TaskCard({
  task,
  onDragStart,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const actions = [
    { label: 'ویرایش', icon: Pencil, onClick: () => onEdit?.(task) },
    { label: 'حذف', icon: Trash2, onClick: () => onDelete?.(task.id), destructive: true },
  ];

  return (
    <Card
      draggable
      role="listitem"
      aria-label={`تسک: ${task.title}`}
      onDragStart={() => onDragStart(task)}
      className="card-hover group relative cursor-grab border-0 shadow-md transition-all duration-200 active:cursor-grabbing"
    >
      <CardContent className="space-y-2 p-3">
        {/* Header Row: Drag Handle + Title + Menu */}
        <div className="flex items-start gap-2">
          <GripVertical className="text-muted-foreground/30 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium">{task.title}</p>
          </div>

          {/* Three‑dot menu – hidden until hover */}
          <ActionDropdown items={actions} />
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
            <Avatar className="ring-border h-6 w-6 ring-2">
              <AvatarFallback className="bg-primary/10 text-primary text-[9px]">
                {getInitials(task.assignee.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { getInitials } from '@/shared/lib/utils';
import { Calendar, GripVertical, MessageSquare } from 'lucide-react';
import { PRIORITY_DOT_COLORS, TASK_PRIORITY_LABELS } from '../constants';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(task)}
      className="card-hover group cursor-grab border-0 shadow-md transition-all duration-200 active:cursor-grabbing"
    >
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="text-muted-foreground/30 mt-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium">{task.title}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 text-[10px]">
            <div className={`h-2 w-2 rounded-full ${PRIORITY_DOT_COLORS[task.priority]}`} />
            {TASK_PRIORITY_LABELS[task.priority]}
          </Badge>

          {task.dueDate && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString('fa-IR')}
            </Badge>
          )}
        </div>

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
}

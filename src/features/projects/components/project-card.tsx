'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { formatDate, getInitials } from '@/shared/lib/utils';
import { CheckSquare, MoreVertical, Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../types';
import { InviteMemberDialog } from './invite-member-dialog';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <Card className="card-hover group relative border-0 shadow-lg transition-all duration-300">
        <div className="from-primary/5 pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <span className="text-primary text-lg font-bold">{getInitials(project.name)}</span>
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{project.name}</h3>
              <p className="text-muted-foreground text-xs">{formatDate(project.createdAt)}</p>
            </div>
          </div>

          <div className="relative z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Pencil className="ml-2 h-4 w-4" />
                  ویرایش
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowInvite(true)}>
                  <UserPlus className="ml-2 h-4 w-4" />
                  دعوت عضو
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(project)} className="text-destructive">
                  <Trash2 className="text-destructive ml-2 h-4 w-4" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
            {project.description || 'بدون توضیحات'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <CheckSquare className="h-3 w-3" />
                {project._count?.tasks ?? 0} تسک
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                {project._count?.members ?? 0} عضو
              </Badge>
            </div>

            {project.owner && (
              <Avatar className="ring-border h-7 w-7 ring-2">
                <AvatarFallback className="text-[10px]">
                  {getInitials(project.owner.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      {showInvite && (
        <InviteMemberDialog
          projectId={project.id}
          projectName={project.name}
          open={showInvite}
          onOpenChange={setShowInvite}
        />
      )}
    </>
  );
}

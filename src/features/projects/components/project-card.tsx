'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ActionDropdown } from '@/shared/components/action-dropdown';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { canDeleteProject, canManageProject } from '@/shared/lib/permissions';
import { cn, formatDate, getInitials } from '@/shared/lib/utils';
import { CheckSquare, Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDeleteRequest: (projectId: string) => void;
  onInvite: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onDeleteRequest, onInvite }: ProjectCardProps) {
  const { user } = useAuth();
  const userCanManage = canManageProject(user, project);
  const userCanDelete = canDeleteProject(user, project);

  const actions = [];

  if (userCanManage) {
    actions.push({ label: 'ویرایش', icon: Pencil, onClick: () => onEdit(project) });
  }

  if (userCanManage) {
    actions.push({ label: 'دعوت عضو', icon: UserPlus, onClick: () => onInvite(project.id) });
  }

  if (userCanDelete) {
    actions.push({
      label: 'حذف',
      icon: Trash2,
      onClick: () => onDeleteRequest(project.id),
      destructive: true,
    });
  }

  const isOwner = project.ownerId === user?.id;
  const userRole = project.members?.find((m) => m.userId === user?.id)?.role;

  return (
    <Card className="card-hover group border-border/50 bg-card dark:border-border/30 dark:bg-card/80 dark:hover:border-border/50 relative border shadow-sm transition-all duration-300">
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
        {actions.length > 0 && <ActionDropdown items={actions} />}
        {actions.length === 0 && (
          <Badge variant="outline" className="text-[10px]">
            فقط مشاهده
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground/80 mb-4 line-clamp-2 text-sm">
          {project.description || 'بدون توضیحات'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <CheckSquare className="h-3 w-3" /> {project._count?.tasks ?? 0} تسک
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" /> {project._count?.members ?? 0} عضو
            </Badge>
            {/* Role badge */}
            {userRole && (
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px]',
                  userRole === 'ADMIN' && 'border-primary/50 text-primary',
                  userRole === 'MANAGER' && 'border-blue-500/50 text-blue-500'
                )}
              >
                {userRole === 'ADMIN' ? 'مدیر' : userRole === 'MANAGER' ? 'مدیر پروژه' : 'عضو'}
              </Badge>
            )}
          </div>
          {project.owner && (
            <div className="relative">
              <Avatar className="ring-border h-7 w-7 ring-2">
                <AvatarFallback className="text-[10px]">
                  {getInitials(project.owner.name)}
                </AvatarFallback>
              </Avatar>
              {isOwner && (
                <span
                  className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400"
                  title="مالک پروژه"
                >
                  <span className="text-[7px]">★</span>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

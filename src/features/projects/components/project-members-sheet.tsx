'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { ROLE_LABELS, canManageProject } from '@/shared/lib/permissions';
import { cn } from '@/shared/lib/utils';
import { usePresence } from '@/shared/providers/presence-provider';
import { Calendar, Crown, Shield, ShieldCheck, User, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { useUpdateMemberRole } from '../hooks/use-project-members';
import type { Project } from '../types';
import { InviteMemberDialog } from './invite-member-dialog';

const ROLE_CONFIG = {
  ADMIN: {
    label: ROLE_LABELS.ADMIN,
    icon: ShieldCheck,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    description: 'دسترسی کامل به تنظیمات پروژه، مدیریت اعضا و همه تسک‌ها',
  },
  MANAGER: {
    label: ROLE_LABELS.MANAGER,
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'ایجاد، ویرایش و حذف همه تسک‌ها',
  },
  MEMBER: {
    label: ROLE_LABELS.MEMBER,
    icon: User,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-muted',
    description: 'مشاهده تسک‌ها، کامنت و تغییر وضعیت تسک‌های واگذار شده',
  },
} as const;

const PERMISSION_MATRIX = [
  { label: 'حذف پروژه', owner: true, admin: false, manager: false, member: false },
  { label: 'ویرایش تنظیمات', owner: true, admin: true, manager: false, member: false },
  { label: 'مدیریت اعضا و نقش‌ها', owner: true, admin: true, manager: false, member: false },
  { label: 'ایجاد تسک', owner: true, admin: true, manager: true, member: false },
  { label: 'ویرایش همه تسک‌ها', owner: true, admin: true, manager: true, member: false },
  { label: 'حذف همه تسک‌ها', owner: true, admin: true, manager: true, member: false },
  { label: 'تغییر وضعیت تسک خود', owner: true, admin: true, manager: true, member: true },
  { label: 'کامنت گذاشتن', owner: true, admin: true, manager: true, member: true },
];

interface Props {
  project: Project;
  currentUserId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectMembersSheet({ project, currentUserId, open, onOpenChange }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const { isUserOnline } = usePresence();
  const updateRoleMutation = useUpdateMemberRole(project.id);

  const members = project.members ?? [];
  const isOwner = project.ownerId === currentUserId;
  const canManageRoles = canManageProject({ id: currentUserId }, project); // owner or ADMIN

  const membersOnly = members.filter((m) => m.userId !== project.ownerId);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-110">
          <SheetHeader className="border-b px-6 py-4">
            <div>
              <SheetTitle className="text-base">{project.name}</SheetTitle>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                <Users className="h-3.5 w-3.5" />
                {members.length} عضو
                {isOwner && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 text-[10px] text-amber-500"
                  >
                    <Crown className="mr-1 h-3 w-3" />
                    شما مالک هستید
                  </Badge>
                )}
              </p>
            </div>
          </SheetHeader>

          {/* Owner section unchanged */}

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  اعضا ({membersOnly.length})
                </span>
                {canManageRoles && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInviteOpen(true)}
                    className="h-7 gap-1.5 text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    دعوت
                  </Button>
                )}
              </div>

              {/* members list unchanged but using ROLE_LABELS via ROLE_CONFIG */}

              {membersOnly.map((member) => {
                const config =
                  ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.MEMBER;
                const Icon = config.icon;
                const isCurrentUser = member.userId === currentUserId;

                return (
                  <div
                    key={member.id}
                    className="group hover:bg-muted/50 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors"
                  >
                    {/* avatar / online badge */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.user.name}
                        {isCurrentUser && (
                          <span className="text-muted-foreground mr-1 text-[10px]">(شما)</span>
                        )}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        عضو از{' '}
                        {new Date(member.joinedAt).toLocaleDateString('fa-IR', { month: 'long' })}
                      </p>
                    </div>

                    {canManageRoles && !isCurrentUser ? (
                      <Select
                        value={member.role}
                        onValueChange={(role) =>
                          updateRoleMutation.mutate({ memberId: member.id, role })
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            'h-7 w-32 min-w-fit border-0 text-[11px] font-medium',
                            config.bgColor,
                            config.color
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">
                            <span className="flex items-center gap-1.5 text-xs">
                              <ShieldCheck className="text-primary h-3.5 w-3.5" />
                              {ROLE_LABELS.ADMIN}
                            </span>
                          </SelectItem>
                          <SelectItem value="MANAGER">
                            <span className="flex items-center gap-1.5 text-xs">
                              <Shield className="h-3.5 w-3.5 text-blue-500" />
                              {ROLE_LABELS.MANAGER}
                            </span>
                          </SelectItem>
                          <SelectItem value="MEMBER">
                            <span className="flex items-center gap-1.5 text-xs">
                              <User className="text-muted-foreground h-3.5 w-3.5" />
                              {ROLE_LABELS.MEMBER}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={cn(
                                'gap-1 border-0 px-2 py-0.5 text-[10px]',
                                config.bgColor,
                                config.color
                              )}
                            >
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-44 text-[11px]">
                            {config.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Role guide unchanged */}
          </div>
        </SheetContent>
      </Sheet>

      <InviteMemberDialog
        projectId={project.id}
        projectName={project.name}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </>
  );
}

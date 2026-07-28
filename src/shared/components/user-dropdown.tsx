'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ROUTES } from '@/shared/lib/routes';
import { getInitials } from '@/shared/lib/utils';
import { ChevronRight, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

const roleLabels: Record<string, string> = {
  ADMIN: 'مدیر سیستم',
  MANAGER: 'مدیر پروژه',
  MEMBER: 'عضو',
};

export function UserDropdown({ user, align = 'end' }: UserDropdownProps) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="ring-border hover:ring-primary/30 h-8 w-8 ring-2 transition-all hover:shadow-md">
            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {getInitials(user.name || 'کاربر')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2" align={align}>
        {/* User Card */}
        <div className="flex items-center gap-3 p-3">
          <Avatar className="ring-border/50 h-12 w-12 ring-2">
            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(user.name || 'کاربر')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">{user.name || 'کاربر'}</p>
            <p className="text-muted-foreground truncate text-xs">{user.email}</p>
            {user.role && (
              <span className="text-primary bg-primary/10 mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium">
                {roleLabels[user.role] || user.role}
              </span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.SETTINGS}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted group-hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
                  <User className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                </div>
                <span className="font-medium">پروفایل</span>
              </div>
              <ChevronRight className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 transition-colors" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.SETTINGS}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted group-hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
                  <Settings className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                </div>
                <span className="font-medium">تنظیمات</span>
              </div>
              <ChevronRight className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 transition-colors" />
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          className="group text-destructive/80 hover:text-destructive flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm"
        >
          <div className="bg-destructive/5 group-hover:bg-destructive/10 mr-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="font-medium">خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

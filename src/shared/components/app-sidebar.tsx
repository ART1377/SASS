'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/lib/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { getInitials } from '@/shared/lib/utils';

const navigation = [
  {
    title: 'داشبورد',
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD,
  },
  {
    title: 'پروژه‌ها',
    icon: FolderKanban,
    href: ROUTES.PROJECTS,
  },
  {
    title: 'تسک‌ها',
    icon: CheckSquare,
    href: ROUTES.TASKS,
  },
  {
    title: 'چت',
    icon: MessageSquare,
    href: ROUTES.CHAT,
  },
  {
    title: 'اعلان‌ها',
    icon: Bell,
    href: ROUTES.NOTIFICATIONS,
  },
  {
    title: 'تنظیمات',
    icon: Settings,
    href: ROUTES.SETTINGS,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar side="right" className="border-l-0 shadow-2xl">
      <SidebarHeader className="border-b border-sidebar-border/50 p-5">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 pulse-glow transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-bold text-lg">تسک منیجر</div>
            <div className="text-xs text-muted-foreground">Pro</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/50 mb-3 px-3 uppercase tracking-wider">
            منو اصلی
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="group relative h-11 rounded-xl px-3 transition-all duration-300 ease-out
                        hover:bg-sidebar-accent/70 hover:scale-[1.02] hover:shadow-sm
                        active:scale-[0.98]"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300
                            ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                : 'bg-transparent text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground group-hover:shadow-sm'
                            }
                          `}
                        >
                          <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        </span>
                        <span
                          className={`text-sm transition-all duration-300 ${
                            isActive ? 'font-semibold text-foreground' : 'font-normal text-muted-foreground group-hover:text-foreground'
                          }`}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <span className="mr-auto flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3 mb-3 transition-all duration-200 hover:bg-sidebar-accent/70">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40 hover:scale-105">
            <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(user?.name || 'کاربر')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || 'کاربر'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 py-5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              <span>خروج از حساب</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
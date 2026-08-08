'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
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
import { ROUTES } from '@/shared/lib/routes';
import { getInitials } from '@/shared/lib/utils';
import {
  Bell,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      <SidebarHeader className="border-sidebar-border/50 border-b p-5">
        <Link href={ROUTES.DASHBOARD} className="group flex items-center gap-3">
          <div className="bg-primary/10 pulse-glow group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110">
            <Sparkles className="text-primary h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold">تسک منیجر</div>
            <div className="text-muted-foreground text-xs">Pro</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/50 mb-3 px-3 text-xs font-semibold tracking-wider uppercase">
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
                      className="group hover:bg-sidebar-accent/70 relative h-11 rounded-xl px-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'
                              : 'text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground bg-transparent group-hover:shadow-sm'
                          } `}
                        >
                          <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        </span>
                        <span
                          className={`text-sm transition-all duration-300 ${
                            isActive
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground group-hover:text-foreground font-normal'
                          }`}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <span className="mr-auto flex h-1.5 w-1.5">
                            <span className="bg-primary/40 absolute inline-flex h-full w-full animate-ping rounded-full" />
                            <span className="bg-primary relative inline-flex h-1.5 w-1.5 rounded-full" />
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

      <SidebarFooter className="border-sidebar-border/50 border-t p-4">
        <div className="bg-sidebar-accent/50 hover:bg-sidebar-accent/70 mb-3 flex items-center gap-3 rounded-xl p-3 transition-all duration-200">
          <Avatar className="ring-primary/20 hover:ring-primary/40 h-9 w-9 ring-2 transition-all duration-300 hover:scale-105">
            {/* <AvatarImage src={user?.image || undefined} alt={user?.name || ''} /> */}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(user?.name || 'کاربر')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name || 'کاربر'}</p>
            <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl py-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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

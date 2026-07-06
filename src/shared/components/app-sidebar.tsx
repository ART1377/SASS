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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/lib/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';

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
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FolderKanban className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="font-semibold">تسک منیجر</div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>منو اصلی</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>خروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
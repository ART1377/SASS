'use client';

import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { ThemeQuickSwitch } from '@/features/settings/components/theme-quick-switch';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { UserDropdown } from '@/shared/components/user-dropdown';

interface AppHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6">
      <SidebarTrigger />
      <div className="flex-1" />
      <ThemeQuickSwitch />
      <NotificationBell />
      <UserDropdown user={user} />
    </header>
  );
}

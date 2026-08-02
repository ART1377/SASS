'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { ThemeQuickSwitch } from '@/features/settings/components/theme-quick-switch';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { UserDropdown } from '@/shared/components/user-dropdown';
import { ROUTES } from '@/shared/lib/routes';
import {
  Bell,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { title: 'داشبورد', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { title: 'پروژه‌ها', icon: FolderKanban, href: ROUTES.PROJECTS },
  { title: 'تسک‌ها', icon: CheckSquare, href: ROUTES.TASKS },
  { title: 'چت', icon: MessageSquare, href: ROUTES.CHAT },
  { title: 'اعلان‌ها', icon: Bell, href: ROUTES.NOTIFICATIONS },
  { title: 'تنظیمات', icon: Settings, href: ROUTES.SETTINGS },
];

export function MobileHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur-xl md:hidden">
      {/* Hamburger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-75 p-0">
          <SheetHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Sparkles className="text-primary h-4 w-4" />
                </div>
                <SheetTitle className="text-base">تسک منیجر</SheetTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <div className="flex flex-col p-3">
            {user && (
              <div className="bg-muted/50 mb-4 flex items-center gap-3 rounded-xl p-3">
                <UserDropdown user={user} align="start" />
              </div>
            )}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 border-t pt-4">
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>خروج از حساب</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
        <Sparkles className="text-primary h-5 w-5" />
        <span className="text-sm font-semibold">تسک منیجر</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeQuickSwitch />
        <NotificationBell />
        <UserDropdown user={user || {}} />
      </div>
    </header>
  );
}

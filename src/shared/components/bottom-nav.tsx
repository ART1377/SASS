'use client';

import { cn } from '@/shared/lib/utils';
import { Bell, CheckSquare, FolderKanban, LayoutDashboard, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    title: 'داشبورد',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'پروژه‌ها',
    icon: FolderKanban,
    href: '/projects',
  },
  {
    title: 'تسک‌ها',
    icon: CheckSquare,
    href: '/tasks',
    badge: '۳',
  },
  {
    title: 'چت',
    icon: MessageSquare,
    href: '/chat',
    badge: '۵',
  },
  {
    title: 'اعلان‌ها',
    icon: Bell,
    href: '/notifications',
    badge: '۲',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/80 safe-area-bottom fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn('h-5 w-5 transition-all duration-200', isActive && 'scale-110')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  isActive && 'font-semibold'
                )}
              >
                {item.title}
              </span>
              {isActive && (
                <span className="bg-primary absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

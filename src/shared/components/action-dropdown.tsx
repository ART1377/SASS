'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { LucideIcon } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

interface ActionItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
}

interface ActionDropdownProps {
  items: ActionItem[];
  align?: 'start' | 'center' | 'end';
}

export function ActionDropdown({ items, align = 'end' }: ActionDropdownProps) {
  const normalItems = items.filter((item) => !item.destructive);
  const destructiveItems = items.filter((item) => item.destructive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="hover:bg-primary/20 group-hover:bg-primary/10 group-hover:text-primary flex h-8 w-8 shrink-0 cursor-pointer! items-center justify-center rounded-lg p-1 transition duration-300"
        >
          <MoreVertical className="text-muted-foreground h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40">
        {normalItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
            className="cursor-pointer gap-2 text-xs"
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </DropdownMenuItem>
        ))}

        {destructiveItems.length > 0 && normalItems.length > 0 && <DropdownMenuSeparator />}

        {destructiveItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
            className="text-destructive hover:bg-destructive/10! hover:text-destructive! cursor-pointer gap-2 text-xs"
          >
            <item.icon className="text-destructive hover:text-destructive h-3.5 w-3.5" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

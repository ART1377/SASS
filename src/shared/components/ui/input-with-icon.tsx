'use client';

import { cn } from '@/shared/lib/utils';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

interface InputWithIconProps extends React.ComponentProps<'input'> {
  icon: LucideIcon;
}

export const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ icon: Icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-xl border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className
          )}
          {...props}
        />
        <Icon className="text-muted-foreground/50 absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2" />
      </div>
    );
  }
);

InputWithIcon.displayName = 'InputWithIcon';

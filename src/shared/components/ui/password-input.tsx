'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Eye, EyeOff, Lock } from 'lucide-react';
import * as React from 'react';

export type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        {/* Lock icon - right side */}
        <Lock className="text-muted-foreground/50 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />

        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'border-input bg-background/50 ring-offset-background placeholder:text-muted-foreground/50 hover:border-primary/30 focus-visible:ring-primary/20 focus-visible:border-primary/50 flex h-11 w-full rounded-xl border px-4 py-2 pr-10 pl-12 text-sm backdrop-blur-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />

        {/* Eye icon - left side */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-1 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="text-muted-foreground hover:text-foreground h-4 w-4 transition-all" />
          ) : (
            <Eye className="text-muted-foreground hover:text-foreground h-4 w-4 transition-all" />
          )}
          <span className="sr-only">{showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}</span>
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };

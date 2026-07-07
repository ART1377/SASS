import { cn } from '@/shared/lib/utils';
import * as React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input bg-background/50 ring-offset-background placeholder:text-muted-foreground/50 hover:border-primary/30 focus-visible:ring-primary/20 focus-visible:border-primary/50 flex min-h-20 w-full rounded-xl border px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

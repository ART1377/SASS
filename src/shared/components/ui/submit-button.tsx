// src/shared/components/ui/submit-button.tsx
import { cn } from '@/shared/lib/utils';
import { Loader2, type LucideIcon } from 'lucide-react';
import { Button } from './button';

interface SubmitButtonProps {
  isLoading: boolean;
  icon?: LucideIcon;
  label: string;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function SubmitButton({
  isLoading,
  icon: Icon,
  label,
  loadingLabel = 'در حال پردازش...',
  className,
  disabled = false,
  variant = 'default',
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      variant={variant}
      className={cn('gap-2', className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </>
      )}
    </Button>
  );
}

import { cn } from '@/shared/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return <div className={cn('container mx-auto space-y-6 p-6', className)}>{children}</div>;
}

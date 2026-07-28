import { cn } from '@/shared/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1600px] space-y-4 md:space-y-6',
        'px-0 md:px-6 lg:px-8',
        'animate-in fade-in slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      {children}
    </div>
  );
}

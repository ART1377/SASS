import { Button } from '@/shared/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'خطایی رخ داد',
  message = 'مشکلی در بارگذاری اطلاعات پیش آمده است',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="text-destructive h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="ml-2 h-4 w-4" />
          تلاش مجدد
        </Button>
      )}
    </div>
  );
}

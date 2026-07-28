'use client';

import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-destructive/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">خطایی رخ داد!</h1>
        <p className="text-muted-foreground mt-2">
          متاسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
        </p>
        <Button onClick={reset} className="mt-6 gap-2">
          <RefreshCw className="h-4 w-4" />
          تلاش مجدد
        </Button>
      </div>
    </div>
  );
}

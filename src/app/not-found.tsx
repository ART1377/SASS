import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/lib/routes';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="relative mx-auto mb-8 h-32 w-32">
          <div className="animate-float absolute inset-0">
            <Search className="text-muted-foreground/20 h-32 w-32" />
          </div>
        </div>
        <h1 className="text-6xl font-bold tracking-tight">۴۰۴</h1>
        <p className="text-muted-foreground mt-4 text-lg">صفحه‌ای که دنبالش هستید پیدا نشد!</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href={ROUTES.DASHBOARD} className="gap-2">
              <Home className="h-4 w-4" />
              بازگشت به داشبورد
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

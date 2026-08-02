import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="relative overflow-hidden border-0 shadow-lg">
          <div className="skeleton-shimmer absolute inset-0" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-8 w-16 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

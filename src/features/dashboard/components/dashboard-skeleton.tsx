import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Stats cards skeleton */}
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

      {/* Main grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="space-y-6 lg:col-span-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-3 w-48 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-75 w-full rounded-xl" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-3 w-48 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-3 w-48 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

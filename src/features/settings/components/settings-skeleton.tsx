import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function SettingsSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-4 w-48 rounded-md" />
      </div>

      {/* Profile summary skeleton */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full md:h-20 md:w-20" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="mt-1 h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </Card>

      {/* Desktop grid skeleton */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-3 w-48 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile tabs skeleton */}
      <div className="md:hidden">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Card className="mt-4 border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { TASK_STATUS_LABELS } from '@/shared/lib/constants';
import { formatDateTime, getInitials } from '@/shared/lib/utils';
import type { DashboardStats } from '../types';

interface RecentActivityProps {
  activities?: DashboardStats['activities'];
  isLoading: boolean;
}

const statusBadgeColors: Record<string, string> = {
  TODO: 'bg-gray-500/10 text-gray-500',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500',
  REVIEW: 'bg-orange-500/10 text-orange-500',
  DONE: 'bg-emerald-500/10 text-emerald-500',
};

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
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
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">فعالیت‌های اخیر</CardTitle>
          <CardDescription>فعالیتی برای نمایش وجود ندارد</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex items-center justify-center py-8 text-sm">
          با ایجاد و بروزرسانی تسک‌ها، فعالیت‌ها اینجا نمایش داده می‌شوند
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">فعالیت‌های اخیر</CardTitle>
        <CardDescription>آخرین تغییرات در پروژه‌ها</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="ring-border h-9 w-9 shrink-0 ring-2">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {getInitials(activity.assignee)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.assignee}</span>{' '}
                  <span className="text-muted-foreground">
                    تسک «{activity.title}» را در {activity.projectName} بروزرسانی کرد
                  </span>
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${statusBadgeColors[activity.status] || ''}`}
                  >
                    {TASK_STATUS_LABELS[activity.status] || activity.status}
                  </Badge>
                  <span className="text-muted-foreground text-[10px]">
                    {formatDateTime(activity.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

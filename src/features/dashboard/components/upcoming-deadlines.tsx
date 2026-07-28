import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatDate } from '@/shared/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import type { DashboardStats } from '../types';

interface UpcomingDeadlinesProps {
  deadlines?: DashboardStats['upcomingDeadlines'];
  isLoading: boolean;
}

const priorityLabels: Record<string, string> = {
  LOW: 'کم',
  MEDIUM: 'متوسط',
  HIGH: 'زیاد',
  URGENT: 'فوری',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  URGENT: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function UpcomingDeadlines({ deadlines, isLoading }: UpcomingDeadlinesProps) {
  if (isLoading) {
    return (
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!deadlines || deadlines.length === 0) {
    return (
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">موعدهای نزدیک</CardTitle>
          <CardDescription>موعدی برای ۷ روز آینده وجود ندارد</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex items-center justify-center py-8 text-sm">
          <Calendar className="mr-2 h-8 w-8 opacity-20" />
          همه تسک‌ها به‌روز هستند
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">موعدهای نزدیک</CardTitle>
        <CardDescription>تسک‌های با موعد تحویل در ۷ روز آینده</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="group border-border/50 bg-background hover:border-primary/20 flex items-start gap-3 rounded-xl border p-3 transition-all duration-200 hover:shadow-sm"
            >
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{deadline.title}</p>
                <p className="text-muted-foreground text-xs">{deadline.projectName}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Clock className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground text-xs">
                    {deadline.dueDate ? formatDate(deadline.dueDate) : 'بدون تاریخ'}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${priorityColors[deadline.priority] || ''}`}
                  >
                    {priorityLabels[deadline.priority] || deadline.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

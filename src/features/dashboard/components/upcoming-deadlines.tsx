import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

const deadlines = [
  {
    task: 'تحویل نسخه نهایی',
    project: 'پروژه آلفا',
    dueDate: 'امروز - ۱۸:۰۰',
    priority: 'high',
  },
  {
    task: 'رفع باگ‌های گزارش شده',
    project: 'پروژه بتا',
    dueDate: 'فردا - ۱۲:۰۰',
    priority: 'urgent',
  },
  {
    task: 'آپدیت مستندات',
    project: 'پروژه گاما',
    dueDate: '۳ روز آینده',
    priority: 'medium',
  },
  {
    task: 'جلسه بررسی اسپرینت',
    project: 'عمومی',
    dueDate: 'جمعه - ۱۰:۰۰',
    priority: 'low',
  },
];

const priorityColors = {
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  low: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const priorityLabels = {
  high: 'بالا',
  urgent: 'فوری',
  medium: 'متوسط',
  low: 'کم',
};

export function UpcomingDeadlines() {
  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">موعدهای نزدیک</CardTitle>
        <CardDescription>تسک‌های با موعد تحویل نزدیک</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline, index) => (
            <div
              key={index}
              className="group flex items-start gap-3 rounded-xl border border-border/50 bg-background p-3 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{deadline.task}</p>
                <p className="text-xs text-muted-foreground">{deadline.project}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{deadline.dueDate}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${priorityColors[deadline.priority as keyof typeof priorityColors]}`}
                  >
                    {priorityLabels[deadline.priority as keyof typeof priorityLabels]}
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
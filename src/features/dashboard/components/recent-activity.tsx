import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { getInitials } from '@/shared/lib/utils';

const activities = [
  {
    user: 'علی محمدی',
    action: 'تسک "طراحی صفحه اصلی" را تکمیل کرد',
    time: '۱۰ دقیقه پیش',
    type: 'task_completed',
  },
  {
    user: 'سارا احمدی',
    action: 'نظر جدیدی روی تسک "بهینه‌سازی دیتابیس" ثبت کرد',
    time: '۳۰ دقیقه پیش',
    type: 'comment',
  },
  {
    user: 'محمد رضایی',
    action: 'به پروژه "وبسایت فروشگاهی" اضافه شد',
    time: '۱ ساعت پیش',
    type: 'member_added',
  },
  {
    user: 'زهرا حسینی',
    action: 'تسک "تست نهایی" را به حالت Review انتقال داد',
    time: '۲ ساعت پیش',
    type: 'status_changed',
  },
];

export function RecentActivity() {
  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">فعالیت‌های اخیر</CardTitle>
        <CardDescription>آخرین فعالیت‌های تیم شما</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar className="h-9 w-9 ring-2 ring-border">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {getInitials(activity.user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {activity.time}
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
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertCircle, CheckSquare, Clock, FolderKanban, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    title: 'کل پروژه‌ها',
    value: '۱۲',
    subtext: '۲ پروژه فعال',
    icon: FolderKanban,
    trend: '+۱۲٪',
    trendUp: true,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'تسک‌های فعال',
    value: '۴۸',
    subtext: '۸ تسک در حال انجام',
    icon: CheckSquare,
    trend: '+۸٪',
    trendUp: true,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'اعضای تیم',
    value: '۷',
    subtext: '۳ نفر آنلاین',
    icon: Users,
    trend: '+۲',
    trendUp: true,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'موعدهای نزدیک',
    value: '۵',
    subtext: '۲ مورد برای امروز',
    icon: Clock,
    trend: '۳ مورد',
    trendUp: false,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="card-hover group relative overflow-hidden border-0 shadow-lg"
        >
          <div className="to-muted/50 absolute inset-0 bg-linear-to-br from-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div
              className={`rounded-xl ${stat.bgColor} p-2 transition-transform duration-300 group-hover:scale-110`}
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-orange-500'}`}
              >
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {stat.trend}
              </div>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">{stat.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

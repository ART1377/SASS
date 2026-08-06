import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertCircle, CheckSquare, Clock, FolderKanban, TrendingUp, Users } from 'lucide-react';
import type { DashboardStats } from '../types';
import { AnimatedNumber } from './animated-number';

interface StatsCardsProps {
  stats: DashboardStats; // ✅ now required
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'کل پروژه‌ها',
      value: stats.totalProjects,
      subtext: `${stats.activeProjects.toLocaleString('fa-IR')} پروژه فعال`,
      icon: FolderKanban,
      trend: null,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'تسک‌ها',
      value: stats.totalTasks,
      subtext: `${stats.statusCounts.IN_PROGRESS.toLocaleString('fa-IR')} در حال انجام`,
      icon: CheckSquare,
      trend:
        stats.statusCounts.DONE > 0
          ? `+${stats.statusCounts.DONE.toLocaleString('fa-IR')} انجام شده`
          : null,
      trendUp: true,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'اعضای تیم',
      value: stats.totalMembers,
      subtext: 'در پروژه‌های شما',
      icon: Users,
      trend: null,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'موعدهای نزدیک',
      value: stats.upcomingDeadlines.length,
      subtext: '۷ روز آینده',
      icon: Clock,
      trend:
        stats.upcomingDeadlines.filter((d) => d.priority === 'URGENT').length > 0
          ? `${stats.upcomingDeadlines.filter((d) => d.priority === 'URGENT').length} فوری`
          : null,
      trendUp: false,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="card-hover group border-border/50 bg-card dark:border-border/30 dark:bg-card/80 relative overflow-hidden border shadow-sm"
        >
          <div className="to-muted/50 absolute inset-0 bg-linear-to-br from-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {card.title}
            </CardTitle>
            <div
              className={`rounded-xl ${card.bgColor} p-2 transition-transform duration-300 group-hover:scale-110`}
            >
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                <AnimatedNumber value={card.value} /> {/* ✅ fixed */}
              </div>
              {card.trend && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-emerald-500' : 'text-orange-500'}`}
                >
                  {card.trendUp ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {card.trend}
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">{card.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

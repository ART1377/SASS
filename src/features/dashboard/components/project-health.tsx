'use client';

import { EmptyState } from '@/shared/components/empty-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, FolderKanban } from 'lucide-react';
import type { DashboardStats } from '../types';

interface ProjectHealthProps {
  stats: DashboardStats;
}

export function ProjectHealth({ stats }: ProjectHealthProps) {
  // Use upcoming deadlines to determine project health
  const urgentDeadlines = stats.upcomingDeadlines.filter((d) => d.priority === 'URGENT');
  const highPriorityDeadlines = stats.upcomingDeadlines.filter((d) => d.priority === 'HIGH');

  if (stats.totalProjects === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderKanban className="text-primary h-5 w-5" />
            سلامت پروژه‌ها
          </CardTitle>
          <CardDescription>پروژه‌ای برای نمایش وجود ندارد</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FolderKanban}
            title="پروژه‌ای یافت نشد"
            description="پس از ایجاد پروژه، وضعیت آن را اینجا ببینید"
            className="py-4"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderKanban className="text-primary h-5 w-5" />
          سلامت پروژه‌ها
        </CardTitle>
        <CardDescription>
          {stats.activeProjects} پروژه فعال از {stats.totalProjects}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Active projects indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'flex items-center gap-3 rounded-xl p-3',
            stats.activeProjects > 0 ? 'bg-emerald-500/10' : 'bg-muted'
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium">{stats.activeProjects} پروژه فعال</p>
            <p className="text-muted-foreground text-xs">
              {stats.totalProjects - stats.activeProjects} پروژه تکمیل شده
            </p>
          </div>
        </motion.div>

        {/* Urgent warnings */}
        {urgentDeadlines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-red-500/10 p-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{urgentDeadlines.length} موعد فوری</p>
              <p className="text-muted-foreground text-xs">نیاز به اقدام سریع</p>
            </div>
          </motion.div>
        )}

        {/* High priority */}
        {highPriorityDeadlines.length > 0 && !urgentDeadlines.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-orange-500/10 p-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {highPriorityDeadlines.length} موعد با اولویت بالا
              </p>
              <p className="text-muted-foreground text-xs">در ۷ روز آینده</p>
            </div>
          </motion.div>
        )}

        {/* All good */}
        {stats.upcomingDeadlines.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium">همه چیز مرتب است</p>
              <p className="text-muted-foreground text-xs">موعد فوری‌ای در ۷ روز آینده ندارید</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

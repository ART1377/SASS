'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TASK_STATUS_LABELS } from '@/shared/lib/constants';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import type { DashboardStats } from '../types';

interface MyTasksOverviewProps {
  stats: DashboardStats;
}

const statusColors: Record<string, string> = {
  TODO: 'bg-gray-500',
  IN_PROGRESS: 'bg-blue-500',
  REVIEW: 'bg-orange-500',
  DONE: 'bg-emerald-500',
};

const statusBarColors: Record<string, string> = {
  TODO: 'bg-gray-100',
  IN_PROGRESS: 'bg-blue-100',
  REVIEW: 'bg-orange-100',
  DONE: 'bg-emerald-100',
};

const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const;

export function MyTasksOverview({ stats }: MyTasksOverviewProps) {
  const total = stats.totalTasks || 1; // prevent division by zero
  const tasksArray = statuses.map((s) => stats.statusCounts[s] || 0);
  const donePercent = Math.round((stats.statusCounts.DONE / total) * 100);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckSquare className="text-primary h-5 w-5" />
          وضعیت تسک‌های من
        </CardTitle>
        <CardDescription>
          {stats.totalTasks} تسک • {donePercent}٪ انجام شده
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${donePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </div>

        {/* Per-status breakdown */}
        <div className="space-y-3">
          {statuses.map((status, index) => {
            const count = stats.statusCounts[status] || 0;
            const percent = Math.round((count / total) * 100);

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2.5 w-2.5 rounded-full', statusColors[status])} />
                    <span className="font-medium">{TASK_STATUS_LABELS[status]}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {count} ({percent}٪)
                  </span>
                </div>
                <div className={cn('h-1.5 overflow-hidden rounded-full', statusBarColors[status])}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + index * 0.1 }}
                    className={cn('h-full rounded-full', statusColors[status])}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

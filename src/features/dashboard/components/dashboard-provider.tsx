'use client';

import { ErrorState } from '@/shared/components/error-state';
import { useDashboard } from '../hooks/use-dashboard';
import { DashboardSkeleton } from './dashboard-skeleton';
import { MyTasksOverview } from './my-tasks-overview';
import { ProjectHealth } from './project-health';
import { ProjectsChart } from './projects-chart';
import { RecentActivity } from './recent-activity';
import { StatsCards } from './stats-cards';
import { UpcomingDeadlines } from './upcoming-deadlines';

export function DashboardProvider() {
  const { data: stats, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!stats) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Row 1: Stats (always full width) ── */}
      <StatsCards stats={stats} />

      {/* ── Row 2: Tasks + Health (side by side on tablet+) ── */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <MyTasksOverview stats={stats} />
        <ProjectHealth stats={stats} />
      </div>

      {/* ── Row 3: Chart – always one row ── */}
      <ProjectsChart projectStats={stats.projectStats} />

      {/* ── Row 4: Deadlines + Activity (side by side on desktop, stacked on mobile) ── */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <UpcomingDeadlines deadlines={stats.upcomingDeadlines} />
        <RecentActivity activities={stats.activities} />
      </div>
    </div>
  );
}

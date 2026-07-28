'use client';

import { ErrorState } from '@/shared/components/error-state';
import { useDashboard } from '../hooks/use-dashboard';
import { ProjectsChart } from './projects-chart';
import { RecentActivity } from './recent-activity';
import { StatsCards } from './stats-cards';
import { UpcomingDeadlines } from './upcoming-deadlines';

export function DashboardProvider() {
  const { data: stats, isLoading, isError, refetch } = useDashboard();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <>
      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="mt-6 grid gap-6 lg:grid-cols-7">
        <div className="space-y-6 lg:col-span-4">
          <ProjectsChart projectStats={stats?.projectStats} isLoading={isLoading} />
          <RecentActivity activities={stats?.activities} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3">
          <UpcomingDeadlines deadlines={stats?.upcomingDeadlines} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}

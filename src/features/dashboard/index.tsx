import { auth } from '@/features/auth/auth-config';
import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { ProjectsChart } from './components/projects-chart';
import { RecentActivity } from './components/recent-activity';
import { StatsCards } from './components/stats-cards';
import { UpcomingDeadlines } from './components/upcoming-deadlines';

export default async function Dashboard() {
  const session = await auth();

  return (
    <PageWrapper>
      <PageHeader
        title={`خوش آمدید، ${session?.user?.name || 'کاربر'} 👋`}
        description="نمای کلی از فعالیت‌ها و پروژه‌های شما"
      />

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="space-y-6 lg:col-span-4">
          <ProjectsChart />
          <RecentActivity />
        </div>
        <div className="lg:col-span-3">
          <UpcomingDeadlines />
        </div>
      </div>
    </PageWrapper>
  );
}

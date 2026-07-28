import { auth } from '@/features/auth/auth-config';
import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { DashboardProvider } from './components/dashboard-provider';

export default async function Dashboard() {
  const session = await auth();

  return (
    <PageWrapper>
      <PageHeader
        title={`خوش آمدید، ${session?.user?.name || 'کاربر'} 👋`}
        description="نمای کلی از فعالیت‌ها و پروژه‌های شما"
      />
      <DashboardProvider />
    </PageWrapper>
  );
}

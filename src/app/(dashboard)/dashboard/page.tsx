import { PageWrapper } from '@/shared/components/page-wrapper';
import { PageHeader } from '@/shared/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { auth } from '@/features/auth/auth-config';
import { CheckSquare, FolderKanban, Users, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <PageWrapper>
      <PageHeader
        title={`خوش آمدید، ${session?.user?.name || 'کاربر'}`}
        description="نمای کلی از فعالیت‌های شما"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل پروژه‌ها</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">۲ پروژه فعال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تسک‌های فعال</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">۸ تسک در حال انجام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">اعضای تیم</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">۳ نفر آنلاین</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موعدهای نزدیک</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">۲ مورد برای امروز</p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
import { auth } from '@/features/auth/auth-config';
import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { getInitials } from '@/shared/lib/utils';
import { ThemeSwitcher } from './components/theme-switcher';

export default async function Settings() {
  const session = await auth();
  const user = session?.user;

  return (
    <PageWrapper>
      <PageHeader title="تنظیمات" description="شخصی‌سازی ظاهر و مدیریت حساب کاربری" />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="card-hover border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">پروفایل</CardTitle>
            <CardDescription>اطلاعات حساب کاربری شما</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="ring-primary/20 h-16 w-16 ring-4 sm:h-20 sm:w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold sm:text-2xl">
                  {getInitials(user?.name || 'کاربر')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{user?.name || 'کاربر'}</p>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <Badge className="mt-2" variant="secondary">
                  مدیر سیستم
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">نام کاربری</span>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">ایمیل</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">نقش</span>
                <span className="text-sm font-medium">مدیر سیستم</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">ظاهر</CardTitle>
            <CardDescription>شخصی‌سازی رنگ و حالت نمایش</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

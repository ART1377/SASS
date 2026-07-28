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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { getInitials } from '@/shared/lib/utils';
import { Lock, Mail, Palette, User } from 'lucide-react';
import { EmailForm } from './components/email-form';
import { PasswordForm } from './components/password-form';
import { ProfileForm } from './components/profile-form';
import { ThemeSwitcher } from './components/theme-switcher';

export default async function Settings() {
  const session = await auth();
  const user = session?.user;

  return (
    <PageWrapper>
      <PageHeader title="تنظیمات" description="مدیریت حساب کاربری و شخصی‌سازی" />

      {/* Profile Summary - Always visible */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="from-primary/5 via-primary/10 bg-linear-to-r to-transparent p-6">
          <div className="flex items-center gap-4">
            <Avatar className="ring-background h-16 w-16 shadow-xl ring-4 md:h-20 md:w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold md:text-2xl">
                {getInitials(user?.name || 'کاربر')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold md:text-xl">{user?.name}</h2>
              <p className="text-muted-foreground truncate text-sm">{user?.email}</p>
              <Badge className="mt-2" variant="secondary">
                {user?.role === 'ADMIN'
                  ? 'مدیر سیستم'
                  : user?.role === 'MANAGER'
                    ? 'مدیر پروژه'
                    : 'عضو'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for Mobile, Grid for Desktop */}
      <div className="hidden md:grid lg:grid-cols-2 md:gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="text-primary h-4 w-4" />
              ویرایش پروفایل
            </CardTitle>
            <CardDescription>نام خود را تغییر دهید</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="text-primary h-4 w-4" />
              تغییر ایمیل
            </CardTitle>
            <CardDescription>آدرس ایمیل جدید وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <EmailForm currentEmail={user?.email} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="text-primary h-4 w-4" />
              تغییر رمز عبور
            </CardTitle>
            <CardDescription>رمز عبور خود را بروزرسانی کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="text-primary h-4 w-4" />
              شخصی‌سازی ظاهر
            </CardTitle>
            <CardDescription>رنگ و حالت نمایش را انتخاب کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Tabbed Interface */}
      <div className="md:hidden">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-muted/50 grid h-auto w-full grid-cols-4 rounded-2xl p-1">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-background gap-1.5 rounded-xl py-2.5 text-xs data-[state=active]:shadow-sm"
            >
              <User className="h-3.5 w-3.5" />
              پروفایل
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="data-[state=active]:bg-background gap-1.5 rounded-xl py-2.5 text-xs data-[state=active]:shadow-sm"
            >
              <Mail className="h-3.5 w-3.5" />
              ایمیل
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="data-[state=active]:bg-background gap-1.5 rounded-xl py-2.5 text-xs data-[state=active]:shadow-sm"
            >
              <Lock className="h-3.5 w-3.5" />
              رمز
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="data-[state=active]:bg-background gap-1.5 rounded-xl py-2.5 text-xs data-[state=active]:shadow-sm"
            >
              <Palette className="h-3.5 w-3.5" />
              تم
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">ویرایش پروفایل</CardTitle>
                <CardDescription>نام خود را تغییر دهید</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">تغییر ایمیل</CardTitle>
                <CardDescription>آدرس ایمیل جدید وارد کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <EmailForm currentEmail={user?.email} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">تغییر رمز عبور</CardTitle>
                <CardDescription>رمز عبور خود را بروزرسانی کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">شخصی‌سازی ظاهر</CardTitle>
                <CardDescription>رنگ و حالت نمایش را انتخاب کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSwitcher />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}

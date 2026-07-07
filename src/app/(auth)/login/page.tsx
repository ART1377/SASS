import { LoginForm } from '@/features/auth/components/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { FolderKanban } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md slide-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 pulse-glow">
            <FolderKanban className="h-8 w-8 text-primary" />
          </div>
          <h1 className="gradient-text text-3xl font-bold">تسک منیجر</h1>
          <p className="mt-2 text-muted-foreground">مدیریت پروژه‌های خود را به روشی نوین تجربه کنید</p>
        </div>
        
        <Card className="glass border-0 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">خوش برگشتی 👋</CardTitle>
            <CardDescription>برای ادامه وارد حساب کاربری خود شوید</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
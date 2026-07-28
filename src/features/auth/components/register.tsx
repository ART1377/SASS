import { Card, CardContent } from '@/shared/components/ui/card';
import { Sparkles } from 'lucide-react';
import { RegisterForm } from './register-form';

export default function Register() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 w-full max-w-105 duration-700">
      <div className="mb-10 text-center">
        <div className="bg-primary shadow-primary/20 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl">
          <Sparkles className="text-primary-foreground h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          عضویت در <span className="text-primary">تسک منیجر</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          همین امروز شروع کنید و تیم خود را مدیریت کنید
        </p>
      </div>

      <Card className="bg-card/80 border-0 shadow-2xl shadow-black/5 backdrop-blur-xl">
        <CardContent className="p-6 sm:p-8">
          <RegisterForm />
        </CardContent>
      </Card>

      <p className="text-muted-foreground/50 mt-6 text-center text-xs">
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </p>
    </div>
  );
}

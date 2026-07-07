import { auth } from '@/features/auth/auth-config';
import { AppHeader } from '@/shared/components/app-header';
import { AppSidebar } from '@/shared/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader user={session.user} />
        <main className="bg-muted/10 flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
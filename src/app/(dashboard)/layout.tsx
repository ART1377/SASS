import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { auth } from '@/features/auth/auth-config';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/shared/components/app-sidebar';
import { AppHeader } from '@/shared/components/app-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader user={session.user} />
          <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
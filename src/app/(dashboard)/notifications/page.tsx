import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';

export default function NotificationsPage() {
  return (
    <PageWrapper>
      <PageHeader title="اعلان‌ها" description="اعلان‌های سیستم" />
      <div className="text-muted-foreground py-12 text-center">اعلان‌ها به زودی...</div>
    </PageWrapper>
  );
}

import { PageWrapper } from '@/shared/components/page-wrapper';
import { PageHeader } from '@/shared/components/page-header';

export default function NotificationsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="اعلان‌ها"
        description="اعلان‌های سیستم"
      />
      <div className="text-center text-muted-foreground py-12">
        اعلان‌ها به زودی...
      </div>
    </PageWrapper>
  );
}
import { PageWrapper } from '@/shared/components/page-wrapper';
import { PageHeader } from '@/shared/components/page-header';

export default function SettingsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="تنظیمات"
        description="تنظیمات حساب کاربری"
      />
      <div className="text-center text-muted-foreground py-12">
        تنظیمات به زودی...
      </div>
    </PageWrapper>
  );
}
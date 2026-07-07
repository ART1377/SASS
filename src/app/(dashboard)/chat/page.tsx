import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';

export default function ChatPage() {
  return (
    <PageWrapper>
      <PageHeader title="چت" description="ارتباط با اعضای تیم" />
      <div className="text-muted-foreground py-12 text-center">پیام‌رسان به زودی...</div>
    </PageWrapper>
  );
}

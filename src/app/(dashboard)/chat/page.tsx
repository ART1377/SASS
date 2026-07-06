import { PageWrapper } from '@/shared/components/page-wrapper';
import { PageHeader } from '@/shared/components/page-header';

export default function ChatPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="چت"
        description="ارتباط با اعضای تیم"
      />
      <div className="text-center text-muted-foreground py-12">
        پیام‌رسان به زودی...
      </div>
    </PageWrapper>
  );
}
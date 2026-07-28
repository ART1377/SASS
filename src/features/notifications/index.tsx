import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { NotificationList } from './components/notification-list';

export default function Notifications() {
  return (
    <PageWrapper>
      <PageHeader title="اعلان‌ها" description="مشاهده و مدیریت اعلان‌های سیستم" />
      <NotificationList />
    </PageWrapper>
  );
}

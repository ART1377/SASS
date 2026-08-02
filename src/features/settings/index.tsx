import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { SettingsView } from './components/settings-view';

export default function Settings() {
  return (
    <PageWrapper>
      <PageHeader title="تنظیمات" description="مدیریت حساب کاربری و شخصی‌سازی" />
      <SettingsView />
    </PageWrapper>
  );
}

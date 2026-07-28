import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { KanbanBoard } from './components/kanban-board';

export default function Tasks() {
  return (
    <PageWrapper>
      <PageHeader title="تسک‌ها" description="مدیریت و پیگیری تسک‌ها با برد کانبان" />
      <KanbanBoard />
    </PageWrapper>
  );
}

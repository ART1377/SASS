import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { ProjectsList } from './components/projects-list';

export default function Projects() {
  return (
    <PageWrapper>
      <PageHeader title="پروژه‌ها" description="مدیریت و پیگیری پروژه‌های تیم" />
      <ProjectsList />
    </PageWrapper>
  );
}

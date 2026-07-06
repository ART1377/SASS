import { PageWrapper } from '@/shared/components/page-wrapper';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="پروژه‌ها"
        description="مدیریت پروژه‌های خود"
        actions={
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            پروژه جدید
          </Button>
        }
      />
      <div className="text-center text-muted-foreground py-12">
        لیست پروژه‌ها به زودی...
      </div>
    </PageWrapper>
  );
}
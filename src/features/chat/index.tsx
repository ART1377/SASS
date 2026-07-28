import { PageHeader } from '@/shared/components/page-header';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { ChatView } from './components/chat-view';
import { CreateChatRoom } from './components/create-chat-room';

export default function Chat() {
  return (
    <PageWrapper>
      <PageHeader
        title="چت"
        description="ارتباط با اعضای تیم در چت گروهی پروژه"
        actions={<CreateChatRoom />}
      />
      <ChatView />
    </PageWrapper>
  );
}

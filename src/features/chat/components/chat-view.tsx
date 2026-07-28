'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { Card } from '@/shared/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useChatRooms } from '../hooks/use-chat';
import type { ChatRoom } from '../types';
import { ChatRoomList } from './chat-room-list';
import { ChatRoomView } from './chat-room-view';

export function ChatView() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const { rooms } = useChatRooms();

  return (
    <div className="grid h-[calc(100vh-12rem)] gap-4 lg:grid-cols-4">
      <Card className="overflow-hidden border-0 shadow-sm lg:col-span-1">
        <ChatRoomList rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} />
      </Card>

      <Card className="flex flex-col overflow-hidden border-0 shadow-sm lg:col-span-3">
        {selectedRoom ? (
          <ChatRoomView chatRoom={selectedRoom} />
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="چتی انتخاب نشده"
            description="از لیست سمت راست یک چت را انتخاب کنید"
            className="h-full"
          />
        )}
      </Card>
    </div>
  );
}

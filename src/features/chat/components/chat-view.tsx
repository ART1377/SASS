'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useChatRooms } from '../hooks/use-chat';
import type { ChatRoom } from '../types';
import { ChatRoomList } from './chat-room-list';
import { ChatRoomListSkeleton } from './chat-room-list-skeleton';
import { ChatRoomView } from './chat-room-view';

export function ChatView() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const { data: rooms = [], isLoading: isRoomsLoading } = useChatRooms();

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const handleBack = () => {
    setSelectedRoom(null);
    setShowSidebar(true);
  };

  return (
    <div className="relative grid h-[calc(100vh-14rem)] gap-0 overflow-hidden lg:grid-cols-4 lg:gap-4">
      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || !selectedRoom) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'absolute inset-0 z-10 lg:relative lg:z-auto lg:col-span-1',
              selectedRoom && 'hidden lg:block'
            )}
          >
            <Card className="h-full overflow-hidden border-0 shadow-sm">
              {isRoomsLoading ? (
                <ChatRoomListSkeleton />
              ) : (
                <ChatRoomList
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  onSelectRoom={handleSelectRoom}
                />
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <motion.div
        className={cn(
          'flex h-full flex-col overflow-hidden lg:col-span-3',
          showSidebar && !selectedRoom && 'hidden lg:flex'
        )}
      >
        <Card className="flex h-full flex-col overflow-hidden border-0 shadow-sm">
          {selectedRoom ? (
            <>
              <div className="flex items-center gap-2 border-b px-4 py-2 lg:hidden">
                <button onClick={handleBack} className="hover:bg-muted rounded-lg p-1">
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium">{selectedRoom.name}</span>
              </div>
              <ChatRoomView chatRoom={selectedRoom} />
            </>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="چتی انتخاب نشده"
              description="از لیست چت‌ها یک گفتگو را انتخاب کنید"
              className="h-full"
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
}

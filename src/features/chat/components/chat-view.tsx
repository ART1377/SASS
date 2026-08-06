'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { useChatRooms } from '../hooks/use-chat';
import type { ChatRoom } from '../types';
import { ChatRoomList } from './chat-room-list';
import { ChatRoomListSkeleton } from './chat-room-list-skeleton';
import { ChatRoomView } from './chat-room-view';

export function ChatView() {
  const [selectedRoomId, setSelectedRoomId] = useQueryState('room');
  const [showSidebar, setShowSidebar] = useState(true);

  const { data: rooms = [], isLoading: isRoomsLoading } = useChatRooms(
    undefined,
    selectedRoomId ?? undefined
  );

  const selectedRoom = selectedRoomId
    ? (rooms.find((r: ChatRoom) => r.id === selectedRoomId) ?? null)
    : null;

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoomId(room.id);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const handleBack = () => {
    setSelectedRoomId(null);
    setShowSidebar(true);
  };

  return (
    <div className="relative flex h-[calc(100vh-14rem)] gap-0 overflow-hidden lg:gap-4">
      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || !selectedRoom) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'absolute inset-0 z-10 lg:relative lg:z-auto lg:min-w-50 lg:shrink-0',
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
          'flex h-full flex-1 flex-col overflow-hidden',
          showSidebar && !selectedRoom && 'hidden lg:flex'
        )}
      >
        <Card className="flex h-full flex-col overflow-hidden border-0 shadow-sm">
          {selectedRoom ? (
            <>
              <div className="flex items-center gap-2 border-b px-4 py-2 lg:hidden">
                <button
                  onClick={handleBack}
                  aria-label="بازگشت به لیست چت‌ها"
                  className="hover:bg-muted rounded-lg p-1"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium">{selectedRoom.name}</span>
              </div>
              <ChatRoomView chatRoom={selectedRoom} key={selectedRoom.id} />
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

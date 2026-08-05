'use client';

import { SearchInput } from '@/shared/components/ui/search-input';
import { cn, formatDateTime } from '@/shared/lib/utils';
import { Hash, MessageSquare, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ChatRoom } from '../types';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
}

export function ChatRoomList({ rooms, selectedRoom, onSelectRoom }: ChatRoomListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = useMemo(
    () =>
      searchQuery
        ? rooms.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : rooms,
    [rooms, searchQuery]
  );

  if (rooms.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="text-muted-foreground/30 mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-3 text-sm">چت رومی وجود ندارد</p>
          <p className="text-muted-foreground/50 mt-1 text-xs">
            با ایجاد پروژه، چت روم ساخته می‌شود
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold">چت‌ها</h3>
        {rooms.length > 3 && (
          <div className="mt-3">
            <SearchInput placeholder="جستجوی چت..." onSearch={setSearchQuery} delay={200} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredRooms.length === 0 ? (
          <p className="text-muted-foreground p-4 text-center text-sm">چتی پیدا نشد</p>
        ) : (
          filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              aria-label={`باز کردن چت ${room.name}`}
              aria-current={selectedRoom?.id === room.id}
              className={cn(
                'flex w-full cursor-pointer! items-start gap-3 rounded-xl px-3 py-3 text-right transition-all duration-200',
                selectedRoom?.id === room.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  selectedRoom?.id === room.id ? 'bg-primary/20' : 'bg-primary/10'
                )}
              >
                {room.type === 'GROUP' ? (
                  <Users className="text-primary h-5 w-5" />
                ) : (
                  <Hash className="text-primary h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium">{room.name}</p>
                  {room.lastMessage && (
                    <span className="text-muted-foreground/50 shrink-0 text-[10px]">
                      {formatDateTime(room.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground truncate text-xs">
                    {room.lastMessage
                      ? room.lastMessage.sender.name + ': ' + room.lastMessage.content
                      : `${room._count?.members ?? 0} عضو • ${room._count?.messages ?? 0} پیام`}
                  </p>
                  {room.unreadCount && room.unreadCount > 0 ? (
                    <span className="bg-primary text-primary-foreground ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold">
                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

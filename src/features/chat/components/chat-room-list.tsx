'use client';

import { cn } from '@/shared/lib/utils';
import { Hash, Users } from 'lucide-react';
import type { ChatRoom } from '../types';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
}

export function ChatRoomList({ rooms, selectedRoom, onSelectRoom }: ChatRoomListProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold">چت‌ها</h3>
      </div>
      <div className="p-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right transition-all duration-200',
              selectedRoom?.id === room.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              {room.type === 'GROUP' ? (
                <Users className="text-primary h-5 w-5" />
              ) : (
                <Hash className="text-primary h-5 w-5" />
              )}
            </div>
            <div className="flex-1 overflow-hidden text-right">
              <p className="truncate text-sm font-medium">{room.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {room._count?.members ?? 0} عضو • {room._count?.messages ?? 0} پیام
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

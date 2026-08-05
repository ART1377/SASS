'use client';

import { DialogHeaderWithIcon } from '@/shared/components/dialog-header-with-icon';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Forward, Loader2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useChatRooms } from '../hooks/use-chat';

interface ForwardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onForward: (roomId: string) => void;
  count: number;
}

export function ForwardDialog({ open, onOpenChange, onForward, count }: ForwardDialogProps) {
  const { data: rooms = [], isLoading } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleForward = () => {
    if (!selectedRoomId) return;
    onForward(selectedRoomId);
    setSelectedRoomId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeaderWithIcon
          icon={Forward}
          title="ارسال به"
          description={`${count} پیام انتخاب شده`}
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : rooms.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              چت رومی برای ارسال وجود ندارد
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-1">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`flex w-full cursor-pointer! items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      selectedRoomId === room.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate">{room.name}</span>
                    <span className="text-muted-foreground ml-auto text-[10px]">
                      {room._count?.members ?? 0} عضو
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button onClick={handleForward} disabled={!selectedRoomId}>
            <Forward className="ml-2 h-4 w-4" />
            ارسال
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

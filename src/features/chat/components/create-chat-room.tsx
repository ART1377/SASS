'use client';

import { useProjects } from '@/features/projects/hooks/use-projects';
import { DialogHeaderWithIcon } from '@/shared/components/dialog-header-with-icon';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Loader2, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCreateChatRoom } from '../hooks/use-chat';

export function CreateChatRoom() {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const { projects } = useProjects();
  const createRoomMutation = useCreateChatRoom();

  const handleCreate = () => {
    if (!projectId) return;
    const project = projects.find((p) => p.id === projectId);
    createRoomMutation.mutate(
      {
        projectId,
        name: `چت ${project?.name || 'عمومی'}`,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setProjectId('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          چت جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100">
        <DialogHeaderWithIcon
          icon={MessageSquare}
          title="ایجاد چت روم"
          description="برای یک پروژه چت گروهی بسازید"
        />
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>پروژه</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب پروژه" />
              </SelectTrigger>
              <SelectContent>
                {projects.length === 0 ? (
                  <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                    ابتدا یک پروژه بسازید
                  </div>
                ) : (
                  projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreate}
            disabled={!projectId || createRoomMutation.isPending}
            className="w-full"
          >
            {createRoomMutation.isPending ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : null}
            ایجاد چت روم
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

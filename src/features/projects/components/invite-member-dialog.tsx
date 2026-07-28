'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../hooks/use-projects';
import { inviteMemberSchema, type InviteMemberFormData } from '../validations';

interface InviteMemberDialogProps {
  projectId: string;
  projectName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteMemberDialog({
  projectId,
  projectName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: InviteMemberDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { inviteMember, isInviting } = useProjects();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: InviteMemberFormData) {
    inviteMember(
      { projectId, email: data.email },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            دعوت عضو
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <UserPlus className="text-primary h-5 w-5" />
            </div>
            <div>
              <DialogTitle>دعوت به پروژه</DialogTitle>
              <DialogDescription>اعضای جدید را به "{projectName}" دعوت کنید</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ایمیل کاربر</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        disabled={isInviting}
                        className="pr-10"
                        {...field}
                      />
                      <Mail className="text-muted-foreground/50 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isInviting} className="w-full">
              {isInviting ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="ml-2 h-4 w-4" />
              )}
              دعوت به پروژه
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

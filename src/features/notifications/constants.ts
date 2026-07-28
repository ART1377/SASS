import type { LucideIcon } from 'lucide-react';
import { AtSign, Bell, CheckSquare, FolderKanban, MessageSquare } from 'lucide-react';

export const NOTIFICATION_ICONS: Record<string, LucideIcon> = {
  TASK_ASSIGNED: CheckSquare,
  TASK_UPDATED: CheckSquare,
  COMMENT_ADDED: MessageSquare,
  PROJECT_INVITE: FolderKanban,
  MENTION: AtSign,
  DEFAULT: Bell,
};

export const NOTIFICATION_COLORS: Record<string, string> = {
  TASK_ASSIGNED: 'bg-blue-500/10 text-blue-500',
  TASK_UPDATED: 'bg-orange-500/10 text-orange-500',
  COMMENT_ADDED: 'bg-purple-500/10 text-purple-500',
  PROJECT_INVITE: 'bg-emerald-500/10 text-emerald-500',
  MENTION: 'bg-pink-500/10 text-pink-500',
  DEFAULT: 'bg-gray-500/10 text-gray-500',
};

export const NOTIFICATION_LABELS: Record<string, string> = {
  TASK_ASSIGNED: 'تسک جدید',
  TASK_UPDATED: 'بروزرسانی تسک',
  COMMENT_ADDED: 'نظر جدید',
  PROJECT_INVITE: 'دعوت به پروژه',
  MENTION: 'منشن',
};

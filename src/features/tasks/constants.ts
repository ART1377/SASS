import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@/shared/lib/constants';

export { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS };

export const KANBAN_COLUMNS = [
  { id: 'TODO', title: 'انجام نشده', color: 'bg-gray-500', borderColor: 'border-gray-500' },
  {
    id: 'IN_PROGRESS',
    title: 'در حال انجام',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
  },
  { id: 'REVIEW', title: 'در بازبینی', color: 'bg-orange-500', borderColor: 'border-orange-500' },
  { id: 'DONE', title: 'انجام شده', color: 'bg-emerald-500', borderColor: 'border-emerald-500' },
] as const;

export const PRIORITY_COLORS = {
  LOW: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  URGENT: 'bg-red-500/10 text-red-500 border-red-500/20',
} as const;

export const PRIORITY_DOT_COLORS = {
  LOW: 'bg-gray-400',
  MEDIUM: 'bg-blue-400',
  HIGH: 'bg-orange-400',
  URGENT: 'bg-red-400',
} as const;

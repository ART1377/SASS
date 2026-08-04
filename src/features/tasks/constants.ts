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

export const APP_NAME = 'Task Manager';
export const APP_DESCRIPTION = 'Modern task management application';

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
} as const;

export const TASK_STATUSES = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
} as const;

export const TASK_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: 'انجام نشده',
  IN_PROGRESS: 'در حال انجام',
  REVIEW: 'در بازبینی',
  DONE: 'انجام شده',
};

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  LOW: 'کم',
  MEDIUM: 'متوسط',
  HIGH: 'زیاد',
  URGENT: 'فوری',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'مدیر سیستم',
  MANAGER: 'مدیر پروژه',
  MEMBER: 'عضو',
};

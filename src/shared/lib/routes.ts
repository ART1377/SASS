export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  CHAT: '/chat',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROJECTS,
  ROUTES.TASKS,
  ROUTES.CHAT,
  ROUTES.NOTIFICATIONS,
  ROUTES.SETTINGS,
  ROUTES.PROFILE,
] as const;

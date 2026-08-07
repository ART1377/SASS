import type { Project, ProjectMember } from '@/features/projects/types';

export type UserRole = 'ADMIN' | 'MANAGER' | 'MEMBER';
export type ProjectRole = 'ADMIN' | 'MANAGER' | 'MEMBER';

interface UserData {
  id: string;
  role?: string | null;
}

/**
 * Check if user is a system admin
 */
export function isSystemAdmin(user: UserData | null | undefined): boolean {
  return user?.role === 'ADMIN';
}

/**
 * Get user's role in a specific project
 */
export function getProjectRole(
  userId: string,
  members: ProjectMember[] | undefined
): ProjectRole | null {
  if (!members) return null;
  const member = members.find((m) => m.userId === userId);
  return (member?.role as ProjectRole) || null;
}

/**
 * Check if user can manage a project (edit, delete, invite)
 */
export function canManageProject(user: UserData | null | undefined, project: Project): boolean {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  if (project.ownerId === user.id) return true;

  // Check if user is project ADMIN or MANAGER
  const role = getProjectRole(user.id, project.members as ProjectMember[]);
  return role === 'ADMIN' || role === 'MANAGER';
}

/**
 * Check if user is the project owner
 */
export function canDeleteProject(user: UserData | null | undefined, project: Project): boolean {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  return project.ownerId === user.id;
}

/**
 * Check if user can create/edit/delete tasks in a project
 */
export function canManageTasks(user: UserData | null | undefined, project: Project): boolean {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  if (project.ownerId === user.id) return true;

  const role = getProjectRole(user.id, project.members as ProjectMember[]);
  return role === 'ADMIN' || role === 'MANAGER';
}

/**
 * Check if user can comment on tasks
 */
export function canComment(user: UserData | null | undefined, project: Project): boolean {
  if (!user) return false;
  if (canManageTasks(user, project)) return true;

  // Regular members can comment too
  const role = getProjectRole(user.id, project.members as ProjectMember[]);
  return role === 'MEMBER';
}

/**
 * Check if user can delete a specific task
 */
export function canDeleteTask(
  user: UserData | null | undefined,
  task: { creatorId: string; projectId: string },
  project: Project
): boolean {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  if (task.creatorId === user.id) return true;
  return canManageTasks(user, project);
}

/**
 * Check if user can edit/delete a specific chat message
 */
export function canManageMessage(
  user: UserData | null | undefined,
  messageSenderId: string
): boolean {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  return messageSenderId === user.id;
}

/**
 * Get the appropriate role label in Persian
 */
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    ADMIN: 'مدیر سیستم',
    MANAGER: 'مدیر پروژه',
    MEMBER: 'عضو',
  };
  return labels[role] || role;
}

/**
 * Check if user is assigned to a specific task
 */
export function isAssignedToTask(
  userId: string,
  task: { assignees?: { userId: string }[] }
): boolean {
  if (!task.assignees) return false;
  return task.assignees.some((a) => a.userId === userId);
}
/**
 * Check if user can move tasks (drag & drop)
 * Allowed: System Admin, Project Owner, Project Admin, Project Manager, Task Creator, Task Assignee
 */
export function canMoveTasks(
  user: UserData | null | undefined,
  project: Project | undefined,
  task?: { creatorId: string; assignees?: { userId: string }[] }
): boolean {
  if (!user) return false;

  // System admin can always move
  if (isSystemAdmin(user)) return true;

  // If no project context, only allow if user created the task or is assigned
  if (!project) {
    if (!task) return false;
    if (task.creatorId === user.id) return true;
    if (isAssignedToTask(user.id, task)) return true;
    return false;
  }

  // Project owner can always move
  if (project.ownerId === user.id) return true;

  // Project admin/manager can move
  const role = getProjectRole(user.id, project.members as ProjectMember[]);
  if (role === 'ADMIN' || role === 'MANAGER') return true;

  // Task creator can move
  if (task && task.creatorId === user.id) return true;

  // Members can move tasks assigned to them
  if (task && isAssignedToTask(user.id, task)) return true;

  return false;
}

/**
 * Check if user can edit a specific task
 * Allowed: System Admin, Project Owner, Project Admin, Project Manager, Task Creator, Task Assignee
 */
export function canEditTask(
  user: UserData | null | undefined,
  task: { creatorId: string; projectId: string; assignees?: { userId: string }[] },
  project: Project
): boolean {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  if (task.creatorId === user.id) return true;
  if (canManageTasks(user, project)) return true;

  // Members can edit tasks assigned to them
  if (isAssignedToTask(user.id, task)) return true;

  return false;
}

/**
 * Get role badge variant
 */
export function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'ADMIN':
      return 'default';
    case 'MANAGER':
      return 'secondary';
    default:
      return 'outline';
  }
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  statusCounts: {
    TODO: number;
    IN_PROGRESS: number;
    REVIEW: number;
    DONE: number;
  };
  projectStats: {
    name: string;
    total: number;
    completed: number;
    inProgress: number;
  }[];
  upcomingDeadlines: {
    id: string;
    title: string;
    projectName: string;
    dueDate: string | null;
    priority: string;
    status: string;
  }[];
  activities: {
    id: string;
    title: string;
    status: string;
    projectName: string;
    updatedAt: string;
    assignee: string;
    creator: string;
  }[];
  totalMembers: number;
}

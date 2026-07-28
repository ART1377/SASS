export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
  assigneeId: string | null;
  creatorId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
  creator?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  project?: {
    id: string;
    name: string;
  };
  _count?: {
    comments: number;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
}

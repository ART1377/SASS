export interface TaskAssignee {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
  creatorId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees?: TaskAssignee[]; // ← Must have this
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
  assigneeIds?: string[]; // Changed to array
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeIds?: string[]; // Changed to array
  dueDate?: string | null;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
}

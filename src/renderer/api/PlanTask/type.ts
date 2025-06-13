export interface TaskNode {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  plannedStartTime?: string;
  plannedEndTime?: string;
  status: 'pending' | 'in-progress' | 'completed';
}
export interface PlanTask {
  id: string;
  title: string;
  description?: string;
  nodes: TaskNode[];
  createdAt: string;
  updatedAt: string;
}

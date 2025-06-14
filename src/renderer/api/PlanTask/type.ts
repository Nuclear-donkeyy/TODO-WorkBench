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
export interface addNewPlanTaskParam {
  id: string;
  title: string;
  description?: string;
  nodes: TaskNode[];
  createdAt: string;
  updatedAt: string;
}
export interface addNewPlanNodeParam {
  taskId: string;
  newNode: TaskNode;
}
export interface toggleNodeCompleteParam {
  taskId: string;
  nodeId: string;
}

export interface DeleteNodeParam {
  taskId: string;
  nodeId: string;
}

export interface DeletePlanTaskParam {
  taskId: string;
}

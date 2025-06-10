// TODO任务相关类型定义
export interface TodoItem {
  id: string;
  content: string;
  color: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 创建TODO任务的参数
export interface CreateTodoParams {
  content: string;
  color: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// 更新TODO任务的参数
export interface UpdateTodoParams {
  id: string;
  content?: string;
  color?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
}

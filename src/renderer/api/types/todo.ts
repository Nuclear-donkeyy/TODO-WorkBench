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

// API响应的通用格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

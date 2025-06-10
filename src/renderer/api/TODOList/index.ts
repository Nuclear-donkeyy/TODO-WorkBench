import {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from '../types/todo';
import { CreateTodoParams, TodoItem, UpdateTodoParams } from './types';

// 模拟数据存储
let mockTodos: TodoItem[] = [
  {
    id: '1',
    content: '完成项目文档',
    color: '#667eea',
    description: '编写技术文档和用户手册',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: '代码审查',
    color: '#00d4aa',
    description: '审查团队成员提交的代码',
    startDate: '2024-01-16',
    endDate: '2024-01-17',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    content: '准备演示',
    color: '#ef4444',
    description: '为客户演示准备材料',
    startDate: '2024-01-18',
    endDate: '2024-01-22',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 模拟网络延迟
const delay = (ms: number = 500): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * 获取TODO列表（分页）
 */
export const getTodoList = async (
  params: PaginationParams = { page: 1, limit: 10 }
): Promise<ApiResponse<PaginatedResponse<TodoItem>>> => {
  try {
    await delay();

    const { page, limit } = params;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const items = mockTodos.slice(startIndex, endIndex);
    const total = mockTodos.length;
    const hasMore = endIndex < total;

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        hasMore,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: '获取TODO列表失败',
    };
  }
};

/**
 * 获取单个TODO详情
 */
export const getTodoById = async (
  id: string
): Promise<ApiResponse<TodoItem>> => {
  try {
    await delay(300);

    const todo = mockTodos.find(item => item.id === id);

    if (!todo) {
      return {
        success: false,
        error: '未找到指定的TODO任务',
      };
    }

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    return {
      success: false,
      error: '获取TODO详情失败',
    };
  }
};

/**
 * 创建新的TODO任务
 */
export const createTodo = async (
  params: CreateTodoParams
): Promise<ApiResponse<TodoItem>> => {
  try {
    await delay(600);

    const newTodo: TodoItem = {
      id: generateId(),
      ...params,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTodos.unshift(newTodo); // 添加到列表开头

    return {
      success: true,
      data: newTodo,
      message: 'TODO任务创建成功',
    };
  } catch (error) {
    return {
      success: false,
      error: '创建TODO任务失败',
    };
  }
};

/**
 * 更新TODO任务
 */
export const updateTodo = async (
  params: UpdateTodoParams
): Promise<ApiResponse<TodoItem>> => {
  try {
    await delay(400);

    const todoIndex = mockTodos.findIndex(item => item.id === params.id);

    if (todoIndex === -1) {
      return {
        success: false,
        error: '未找到指定的TODO任务',
      };
    }

    // 更新任务
    const updatedTodo: TodoItem = {
      ...mockTodos[todoIndex],
      ...params,
      updatedAt: new Date().toISOString(),
    };

    mockTodos[todoIndex] = updatedTodo;

    return {
      success: true,
      data: updatedTodo,
      message: 'TODO任务更新成功',
    };
  } catch (error) {
    return {
      success: false,
      error: '更新TODO任务失败',
    };
  }
};

/**
 * 删除TODO任务
 */
export const deleteTodo = async (id: string): Promise<ApiResponse<boolean>> => {
  try {
    await delay(300);

    const todoIndex = mockTodos.findIndex(item => item.id === id);

    if (todoIndex === -1) {
      return {
        success: false,
        error: '未找到指定的TODO任务',
      };
    }

    mockTodos.splice(todoIndex, 1);

    return {
      success: true,
      data: true,
      message: 'TODO任务删除成功',
    };
  } catch (error) {
    return {
      success: false,
      error: '删除TODO任务失败',
    };
  }
};

/**
 * 切换TODO任务完成状态
 */
export const toggleTodoComplete = async (
  id: string
): Promise<ApiResponse<TodoItem>> => {
  try {
    await delay(200);

    const todo = mockTodos.find(item => item.id === id);

    if (!todo) {
      return {
        success: false,
        error: '未找到指定的TODO任务',
      };
    }

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date().toISOString(),
    };

    const todoIndex = mockTodos.findIndex(item => item.id === id);
    mockTodos[todoIndex] = updatedTodo;

    return {
      success: true,
      data: updatedTodo,
      message: `任务已${updatedTodo.completed ? '完成' : '未完成'}`,
    };
  } catch (error) {
    return {
      success: false,
      error: '切换任务状态失败',
    };
  }
};

/**
 * 批量删除已完成的任务
 */
export const deleteCompletedTodos = async (): Promise<
  ApiResponse<{ deletedCount: number }>
> => {
  try {
    await delay(500);

    const completedCount = mockTodos.filter(todo => todo.completed).length;
    mockTodos = mockTodos.filter(todo => !todo.completed);

    return {
      success: true,
      data: { deletedCount: completedCount },
      message: `已删除 ${completedCount} 个已完成的任务`,
    };
  } catch (error) {
    return {
      success: false,
      error: '批量删除失败',
    };
  }
};

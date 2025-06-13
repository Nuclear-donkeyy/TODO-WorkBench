import { ApiResponse } from '../types/todo';
import { CreateTodoParams, TodoItem, UpdateTodoParams } from './types';
import { mockTodos } from '../mockdata';
import { delay, generateId } from '../utils';

/**
 * 获取TODO列表
 */
export const getTodoList = async (): Promise<ApiResponse<TodoItem[]>> => {
  await delay();
  try {
    return {
      success: true,
      data: mockTodos,
    };
  } catch (error) {
    return {
      success: false,
      error: '获取TODO列表失败',
    };
  }
};

/**
 * 创建新的TODO任务
 */
export const createTodo = async (
  params: CreateTodoParams
): Promise<ApiResponse<TodoItem>> => {
  await delay();
  try {
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
  await delay();
  try {
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
  await delay();
  try {
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
  await delay();
  try {
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

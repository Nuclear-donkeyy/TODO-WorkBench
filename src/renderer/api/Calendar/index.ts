import { mockTodos } from '../mockdata';
import { TodoItem } from '../TODOList/types';
import { ApiResponse } from '../types/todo';
import { delay } from '../utils';

export const getAllTodosByDate = async (
  date: string
): Promise<ApiResponse<TodoItem[]>> => {
  await delay();
  const todos =
    mockTodos.filter(todo => todo.endDate && todo.endDate === date) || [];

  return {
    success: true,
    data: todos,
  };
};

export const getAllTodosByMonth = async (
  date: string
): Promise<ApiResponse<TodoItem[]>> => {
  await delay();
  console.log('api--------' + date);
  const todos = mockTodos.filter(
    todo => todo.endDate && todo.endDate.startsWith(date)
  );
  return {
    success: true,
    data: todos,
  };
};

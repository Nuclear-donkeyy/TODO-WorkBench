import { mockSampleTasks } from '../mockdata';
import { ApiResponse } from '../types/todo';
import { delay } from '../utils';
import { PlanTask } from './type';

export const getAllPlanTask = async (): Promise<ApiResponse<PlanTask[]>> => {
  await delay();
  const data = mockSampleTasks;
  return {
    success: true,
    data: data,
  };
};

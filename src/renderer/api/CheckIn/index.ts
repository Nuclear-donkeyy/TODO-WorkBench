import { mockCheckInTask } from '../mockdata';
import { ApiResponse } from '../types/todo';
import { delay } from '../utils';
import {
  AddCheckInTaskParam,
  CheckInTask,
  CheckInTaskParam,
  DeleteCheckInTaskParam,
  ResetCheckInTaskParam,
  UpdateCheckInTaskParam,
} from './type';

export const getAllCheckIn = async (): Promise<ApiResponse<CheckInTask[]>> => {
  await delay();
  const CheckInTasks = mockCheckInTask;
  return {
    success: true,
    data: CheckInTasks,
  };
};
export const deleteCheckInTask = async (
  param: DeleteCheckInTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  const index = mockCheckInTask.findIndex(task => {
    return task.id === param.id;
  });
  mockCheckInTask.splice(index, 1);
  return {
    success: true,
  };
};

export const checkInTask = async (
  param: CheckInTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  mockCheckInTask.forEach(task => {
    if (task.id === param.id) {
      task.isCheckedIn = true;
      task.checkedInAt = new Date().toLocaleString();
      task.streak = task.streak + 1;
    }
  });
  return {
    success: true,
  };
};

export const resetCheckInTask = async (
  param: ResetCheckInTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  mockCheckInTask.forEach(task => {
    if (task.id === param.id) {
      task.isCheckedIn = false;
    }
  });
  return {
    success: true,
  };
};

export const addCheckInTaskParam = async (
  param: AddCheckInTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  const newCheckInTask: CheckInTask = {
    id: param.id,
    title: param.title,
    description: param.description,
    isCheckedIn: param.isCheckIn,
    streak: param.streak,
  };
  mockCheckInTask.push(newCheckInTask);
  return {
    success: true,
  };
};

export const updateCheckInTaskParam = async (
  param: UpdateCheckInTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  mockCheckInTask.forEach(task => {
    if (task.id === param.id) {
      task.description = param.description;
      task.title = param.title;
    }
  });
  return {
    success: true,
  };
};

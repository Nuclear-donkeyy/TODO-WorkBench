import { mockSampleTasks } from '../mockdata';
import { ApiResponse } from '../types/todo';
import { delay } from '../utils';
import {
  addNewPlanNodeParam,
  addNewPlanTaskParam,
  DeleteNodeParam,
  DeletePlanTaskParam,
  PlanTask,
  toggleNodeCompleteParam,
} from './type';

/**
 * 获取所有计划
 */
export const getAllPlanTask = async (): Promise<ApiResponse<PlanTask[]>> => {
  await delay();
  // 深拷贝确保React能检测到状态变化
  const data = JSON.parse(JSON.stringify(mockSampleTasks));
  return {
    success: true,
    data: data,
  };
};

/**
 * 新增任务
 * @param param
 * @returns
 */
export const addNewPlanTask = async (
  param: addNewPlanTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  const newPlanTask = {
    ...param,
  };
  mockSampleTasks.push(newPlanTask);
  return {
    success: true,
  };
};
/**
 * 新增任务节点
 * @param param
 * @returns
 */
export const addNewPlanNode = async (
  param: addNewPlanNodeParam
): Promise<ApiResponse<void>> => {
  const task: PlanTask | undefined = mockSampleTasks.find(
    task => task.id === param.taskId
  );
  if (!task) {
    return {
      success: false,
    };
  }
  if (
    task.nodes.length === 0 ||
    task.nodes[task.nodes.length - 1].status === 'completed'
  ) {
    param.newNode.status = 'in-progress';
  }
  task.nodes.push(param.newNode);
  return {
    success: true,
  };
};

export const toggleNodeComplete = async (
  param: toggleNodeCompleteParam
): Promise<ApiResponse<void>> => {
  const task = mockSampleTasks.find(task => task.id === param.taskId);
  if (!task) {
    return { success: false, message: '找不到该任务' };
  }
  const node = task.nodes.find(node => node.id === param.nodeId);
  const nodeIndex = task.nodes.findIndex(node => node.id === param.nodeId);
  if (!node || nodeIndex === undefined) {
    return { success: false, message: '找不到该任务节点' };
  }

  if (node.status === 'in-progress') {
    if (nodeIndex !== 0 && task.nodes[nodeIndex - 1].status !== 'completed') {
      return { success: false, message: '只能更新第一个进行中节点' };
    }
    node.completed = true;
    node.status = 'completed';
    if (nodeIndex + 1 !== task.nodes.length) {
      task.nodes[nodeIndex + 1].status = 'in-progress';
    }
  } else if (node.status === 'completed') {
    if (nodeIndex + 1 === task.nodes.length) {
      node.completed = false;
      node.status = 'in-progress';
    } else if (task.nodes[nodeIndex + 1].status === 'in-progress') {
      node.completed = false;
      node.status = 'in-progress';
    }
  }
  return {
    success: true,
  };
};

export const deleteTaskNode = async (
  param: DeleteNodeParam
): Promise<ApiResponse<void>> => {
  const task = mockSampleTasks.find(task => task.id === param.taskId);
  if (!task) {
    return { success: false, message: '找不到该任务' };
  }
  const nodeIndex = task.nodes.findIndex(node => node.id === param.nodeId);
  if (nodeIndex === -1) {
    return { success: false, message: '找不到该任务节点' };
  }
  task.nodes.splice(nodeIndex, 1);
  return {
    success: true,
  };
};

export const deletePlanTask = async (
  param: DeletePlanTaskParam
): Promise<ApiResponse<void>> => {
  await delay();
  const taskIndex = mockSampleTasks.findIndex(task => task.id === param.taskId);
  if (taskIndex === -1) {
    return { success: false, message: '找不到该任务' };
  }
  mockSampleTasks.splice(taskIndex, 1);
  return {
    success: true,
  };
};

import React from 'react';
import { Button, message, Progress } from 'antd';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import TaskNodesSection from '@/renderer/components/TaskNodesSection';
import './index.less';
import {
  addNewPlanNodeParam,
  DeleteNodeParam,
  PlanTask,
  TaskNode,
  toggleNodeCompleteParam,
} from '@/renderer/api/PlanTask/type';
import API from '@/renderer/api';

interface PlanTaskCardProps {
  task: PlanTask;
  isExpanded: boolean;
  onToggleExpansion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  fetchTasks: () => Promise<void>;
}

export default function PlanTaskCard(props: PlanTaskCardProps): JSX.Element {
  const { task, isExpanded, onToggleExpansion, onDeleteTask, fetchTasks } =
    props;
  // 添加任务节点
  const handleAddNode = async (
    taskId: string,
    title: string
  ): Promise<void> => {
    if (!title.trim()) {
      message.error('请输入节点标题');
      return;
    }
    const newNode: TaskNode = {
      id: `${taskId}-${Date.now()}`,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const param: addNewPlanNodeParam = {
      taskId: taskId,
      newNode: newNode,
    };
    const response = await API.planTask.addNewPlanNode(param);
    if (response.success) {
      fetchTasks();
      message.success('节点添加成功');
    } else {
      message.error('节点添加失败');
    }
  };

  // 切换节点完成状态
  const toggleNodeComplete = async (
    taskId: string,
    nodeId: string
  ): Promise<void> => {
    const param: toggleNodeCompleteParam = {
      taskId,
      nodeId,
    };
    const response = await API.planTask.toggleNodeComplete(param);
    if (response.success) {
      fetchTasks();
    } else {
      message.error('更新失败:' + response.message);
    }
  };

  // 删除节点
  const handleDeleteNode = async (
    taskId: string,
    nodeId: string
  ): Promise<void> => {
    const param: DeleteNodeParam = {
      taskId,
      nodeId,
    };
    const response = await API.planTask.deleteTaskNode(param);
    if (response.success) {
      fetchTasks();
      message.success('节点删除成功');
    } else {
      message.error('节点删除失败' + response.message);
    }
  };

  // 计算任务进度
  const calculateProgress = (
    nodes: TaskNode[]
  ): { completed: number; total: number; percentage: number } => {
    const completed = nodes.filter(node => node.completed).length;
    const total = nodes.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };
  const progress = calculateProgress(task.nodes);

  return (
    <div className={`task-card ${isExpanded ? 'expanded' : ''}`}>
      <div className='task-header' onClick={() => onToggleExpansion(task.id)}>
        <div className='task-info'>
          <h3 className='task-title'>{task.title}</h3>
          {task.description && (
            <p className='task-description'>{task.description}</p>
          )}
        </div>
        <div className='task-progress'>
          <span className='progress-text'>
            进度 {progress.completed}/{progress.total}
          </span>
          <div className='action-buttons'>
            <Button type='text' icon={<EllipsisOutlined />} size='small' />
            <Button
              type='text'
              icon={<DeleteOutlined />}
              size='small'
              danger
              onClick={e => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='task-details'>
          <div className='progress-bar-container'>
            <Progress
              percent={progress.percentage}
              strokeColor='var(--accent-color)'
              trailColor='var(--surface-tertiary)'
            />
          </div>

          <TaskNodesSection
            nodes={task.nodes}
            onAddNode={(title: string) => handleAddNode(task.id, title)}
            onToggleNodeComplete={(nodeId: string) =>
              toggleNodeComplete(task.id, nodeId)
            }
            onDeleteNode={(nodeId: string) => handleDeleteNode(task.id, nodeId)}
          />
        </div>
      )}
    </div>
  );
}

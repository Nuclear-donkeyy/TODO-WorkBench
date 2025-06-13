import React from 'react';
import { Button, Progress } from 'antd';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import TaskNodesSection from '@/renderer/components/TaskNodesSection';
import './index.less';
import { PlanTask, TaskNode } from '@/renderer/api/PlanTask/type';

interface PlanTaskCardProps {
  task: PlanTask;
  isExpanded: boolean;
  onToggleExpansion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddNode: (taskId: string, title: string) => void;
  onToggleNodeComplete: (taskId: string, nodeId: string) => void;
  onDeleteNode: (taskId: string, nodeId: string) => void;
  calculateProgress: (nodes: TaskNode[]) => {
    completed: number;
    total: number;
    percentage: number;
  };
}

export default function PlanTaskCard(props: PlanTaskCardProps): JSX.Element {
  const {
    task,
    isExpanded,
    onToggleExpansion,
    onDeleteTask,
    onAddNode,
    onToggleNodeComplete,
    onDeleteNode,
    calculateProgress,
  } = props;

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
            onAddNode={(title: string) => onAddNode(task.id, title)}
            onToggleNodeComplete={(nodeId: string) =>
              onToggleNodeComplete(task.id, nodeId)
            }
            onDeleteNode={(nodeId: string) => onDeleteNode(task.id, nodeId)}
          />
        </div>
      )}
    </div>
  );
}

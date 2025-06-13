import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less';
import { TaskNode } from '@/renderer/api/PlanTask/type';

interface TaskNodeProps {
  node: TaskNode;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export default function TaskNode(props: TaskNodeProps): JSX.Element {
  const { node, onToggleComplete, onDelete } = props;

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '进行中';
      default:
        return '待开始';
    }
  };

  return (
    <div className={`task-node ${node.completed ? 'completed' : ''}`}>
      <div className='node-content'>
        <input
          type='checkbox'
          checked={node.completed}
          onChange={onToggleComplete}
          className='node-checkbox'
        />
        <span className='node-title'>{node.title}</span>
        <span className={`node-status ${node.status}`}>
          {getStatusText(node.status)}
        </span>
      </div>
      <Button
        type='text'
        size='small'
        icon={<DeleteOutlined />}
        danger
        onClick={onDelete}
        className='delete-btn'
      />
    </div>
  );
}

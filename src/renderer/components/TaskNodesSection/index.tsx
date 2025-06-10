import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { TaskNode as TaskNodeType } from '../TaskNode';
import './index.less';

interface TaskNodesSectionProps {
  nodes: TaskNodeType[];
  onAddNode: (title: string) => void;
  onToggleNodeComplete: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

export default function TaskNodesSection(
  props: TaskNodesSectionProps
): JSX.Element {
  const { nodes, onAddNode, onToggleNodeComplete, onDeleteNode } = props;
  const [newNodeTitle, setNewNodeTitle] = useState('');

  const handleAddNode = (): void => {
    if (newNodeTitle.trim()) {
      onAddNode(newNodeTitle.trim());
      setNewNodeTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleAddNode();
    }
  };

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

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className='task-nodes-section'>
      <div className='nodes-header'>
        <h4>任务节点</h4>
        <div className='add-node-form'>
          <Input
            placeholder='输入节点标题'
            value={newNodeTitle}
            onChange={e => setNewNodeTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ marginRight: 8 }}
          />
          <Button
            type='primary'
            size='small'
            onClick={handleAddNode}
            disabled={!newNodeTitle.trim()}
          >
            新增
          </Button>
        </div>
      </div>

      <div className='task-timeline'>
        {nodes.length === 0 ? (
          <div className='empty-nodes'>
            <p>暂无节点，点击上方&quot;新增&quot;按钮添加第一个节点</p>
          </div>
        ) : (
          <div className='timeline-content'>
            <div className='timeline-header'>
              <p>任务进度时间线</p>
              <p>
                共 {nodes.length} 个节点，已完成{' '}
                {nodes.filter(n => n.completed).length} 个
              </p>
            </div>

            {nodes.map((node, index) => (
              <div
                key={node.id}
                className={`timeline-node ${node.completed ? 'completed' : ''} ${node.status}`}
              >
                <div className='timeline-left'>
                  <div
                    className={`timeline-dot ${node.completed ? 'completed' : ''} ${node.status}`}
                  >
                    {node.completed && <span className='check-mark'>✓</span>}
                  </div>
                  {index < nodes.length - 1 && (
                    <div className='timeline-line'></div>
                  )}
                </div>

                <div className='timeline-right'>
                  <div className='timeline-card'>
                    <div className='card-header'>
                      <div className='card-title'>
                        <input
                          type='checkbox'
                          checked={node.completed}
                          onChange={() => onToggleNodeComplete(node.id)}
                          className='node-checkbox'
                        />
                        <span
                          className={`node-title ${node.completed ? 'completed' : ''}`}
                        >
                          {node.title}
                        </span>
                      </div>
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => onDeleteNode(node.id)}
                        className='delete-btn'
                      />
                    </div>

                    <div className='card-meta'>
                      <span className={`status-badge ${node.status}`}>
                        {getStatusText(node.status)}
                      </span>
                      <span className='time-info'>
                        创建于 {formatTime(node.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

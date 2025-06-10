import React, { useState } from 'react';
import { Input, Button } from 'antd';
import TaskNode, { TaskNode as TaskNodeType } from '../TaskNode';
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

      <div className='nodes-list'>
        {nodes.length === 0 ? (
          <div className='empty-nodes'>
            <p>暂无节点，点击上方&quot;新增&quot;按钮添加第一个节点</p>
          </div>
        ) : (
          nodes.map(node => (
            <TaskNode
              key={node.id}
              node={node}
              onToggleComplete={() => onToggleNodeComplete(node.id)}
              onDelete={() => onDeleteNode(node.id)}
            />
          ))
        )}
      </div>

      {nodes.length > 0 && (
        <div className='task-timeline'>
          <h4>时间规划</h4>
          <div className='timeline-content'>
            <p>计划开始时间: 2022-5-24 14:43</p>
            <p>计划进行时间: 0天</p>
            <div className='timeline-status'>
              <div className='status-indicator active'></div>
              <span>看一本书</span>
              <span className='time-info'>2022-5-24 14:43至今</span>
            </div>
            <div className='timeline-item'>
              <div className='timeline-dot'></div>
              <div className='timeline-text'>
                <p>看两本书</p>
                <p>未开始</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

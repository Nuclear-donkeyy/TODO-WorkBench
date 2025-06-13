import React, { useState } from 'react';
import { Button, Badge, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.less';
import { CheckInTask } from '@/renderer/api/CheckIn/type';

interface CheckTaskCardProps {
  task: CheckInTask;
  isManageMode: boolean;
  onCheckIn: (taskId: string) => Promise<void>;
  onResetCheckIn: (taskId: string) => Promise<void>;
  onEditTask: (task: CheckInTask) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export default function CheckTaskCard(props: CheckTaskCardProps): JSX.Element {
  const {
    task,
    isManageMode,
    onCheckIn,
    onResetCheckIn,
    onEditTask,
    onDeleteTask,
  } = props;

  // 内部加载状态管理
  const [loadingStates, setLoadingStates] = useState({
    checkIn: false,
    reset: false,
    delete: false,
  });

  const handleCheckIn = async (): Promise<void> => {
    setLoadingStates(prev => ({ ...prev, checkIn: true }));
    try {
      await onCheckIn(task.id);
    } finally {
      setLoadingStates(prev => ({ ...prev, checkIn: false }));
    }
  };

  const handleResetCheckIn = async (): Promise<void> => {
    setLoadingStates(prev => ({ ...prev, reset: true }));
    try {
      await onResetCheckIn(task.id);
    } finally {
      setLoadingStates(prev => ({ ...prev, reset: false }));
    }
  };

  const handleDeleteTask = async (): Promise<void> => {
    setLoadingStates(prev => ({ ...prev, delete: true }));
    try {
      await onDeleteTask(task.id);
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div
      className={`check-task-card ${task.isCheckedIn ? 'checked-in' : ''} ${isManageMode ? 'manage-mode' : ''}`}
    >
      <div className='task-header'>
        <div className='task-info'>
          <Badge
            count={task.streak}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              fontSize: '12px',
            }}
            title={`连续${task.streak}天`}
          />
        </div>
        <div className='task-operations'>
          {task.isCheckedIn && (
            <div className='check-status'>
              <span className='check-icon'>✓</span>
            </div>
          )}
          {isManageMode && (
            <div className='operation-buttons'>
              <Button
                type='text'
                size='small'
                icon={<EditOutlined />}
                onClick={() => onEditTask(task)}
                className='edit-btn'
                title='编辑信息'
              />
              <Popconfirm
                title='确定删除这个打卡项吗？'
                description='删除后将无法恢复'
                onConfirm={handleDeleteTask}
                okText='确定'
                cancelText='取消'
                okType='danger'
              >
                <Button
                  type='text'
                  size='small'
                  icon={<DeleteOutlined />}
                  className='delete-btn'
                  title='删除打卡项'
                  danger
                  loading={loadingStates.delete}
                />
              </Popconfirm>
            </div>
          )}
        </div>
      </div>

      <div className='task-content'>
        <h3 className='task-title'>{task.title}</h3>
        {task.description && (
          <p className='task-description'>{task.description}</p>
        )}

        {task.isCheckedIn && task.checkedInAt && (
          <div className='check-time'>
            <span>已打卡：{task.checkedInAt}</span>
          </div>
        )}
      </div>

      {!isManageMode && (
        <div className='task-actions'>
          {task.isCheckedIn ? (
            <div className='checked-actions'>
              <Button className='checked-btn' disabled icon={<span>✓</span>}>
                已打卡
              </Button>
              <Popconfirm
                title='确定重置打卡状态吗？'
                description='重置后可以重新打卡'
                onConfirm={handleResetCheckIn}
                okText='确定'
                cancelText='取消'
              >
                <Button
                  type='text'
                  size='small'
                  className='reset-btn'
                  loading={loadingStates.reset}
                >
                  重置
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <Button
              type='primary'
              className='check-btn'
              onClick={handleCheckIn}
              loading={loadingStates.checkIn}
            >
              打卡
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

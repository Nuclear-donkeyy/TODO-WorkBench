import React from 'react';
import { Button, Space, Tag } from 'antd';
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { TodoItem } from '../../api/TODOList/types';
import './index.less';

// 设置dayjs中文locale
dayjs.locale('zh-cn');

interface TodoDetailCardProps {
  todo: TodoItem;
  onComplete: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export default function TodoDetailCard(
  props: TodoDetailCardProps
): JSX.Element {
  const { todo, onComplete, onDelete, onEdit } = props;

  const formatDateRange = (): string => {
    if (!todo.startDate || !todo.endDate) return '';

    const start = dayjs(todo.startDate);
    const end = dayjs(todo.endDate);

    if (start.isSame(end, 'day')) {
      return start.format('MM月DD日');
    }

    return `${start.format('MM月DD日')} - ${end.format('MM月DD日')}`;
  };

  return (
    <div className={`todo-detail-card ${todo.completed ? 'completed' : ''}`}>
      <div
        className='color-indicator'
        style={{ backgroundColor: todo.color }}
      />

      <div className='card-content'>
        <div className='todo-header'>
          <h4 className='todo-title'>{todo.content}</h4>
          <Tag color={todo.completed ? 'success' : 'processing'}>
            {todo.completed ? '已完成' : '进行中'}
          </Tag>
        </div>

        {todo.description && (
          <p className='todo-description'>{todo.description}</p>
        )}

        <div className='todo-meta'>
          {formatDateRange() && (
            <span className='date-range'>📅 {formatDateRange()}</span>
          )}
          <span className='created-time'>
            创建于 {dayjs(todo.createdAt).format('MM-DD HH:mm')}
          </span>
        </div>

        <div className='todo-actions'>
          <Space>
            <Button
              type={todo.completed ? 'default' : 'primary'}
              size='small'
              icon={todo.completed ? <UndoOutlined /> : <CheckOutlined />}
              onClick={onComplete}
            >
              {todo.completed ? '取消完成' : '完成'}
            </Button>

            {onEdit && (
              <Button size='small' icon={<EditOutlined />} onClick={onEdit}>
                编辑
              </Button>
            )}

            <Button
              danger
              size='small'
              icon={<DeleteOutlined />}
              onClick={onDelete}
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

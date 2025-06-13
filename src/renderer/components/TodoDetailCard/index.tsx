import React from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { TodoItem } from '../../api/TODOList/types';
import './index.less';

// 设置dayjs中文locale
dayjs.locale('zh-cn');

interface TodoDetailCardProps {
  todo: TodoItem;
}

export default function TodoDetailCard(
  props: TodoDetailCardProps
): JSX.Element {
  const { todo } = props;

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
      </div>
    </div>
  );
}

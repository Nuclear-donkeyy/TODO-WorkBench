import React from 'react';
import { Card, CardBody } from '../../design-system/components';
import { TodoItem } from '../../api/TODOList/types';
import './index.less';

interface TodoItemCardProps {
  todo: TodoItem;
  compact?: boolean;
  onClick?: () => void;
}

export default function TodoItemCard(props: TodoItemCardProps): JSX.Element {
  const { todo, compact = false, onClick } = props;

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Card
      variant='default'
      padding='none'
      clickable={!!onClick}
      hoverable={!!onClick}
      className={`todo-item-card ${compact ? 'todo-item-card--compact' : ''} ${
        todo.completed ? 'todo-item-card--completed' : ''
      }`}
      onClick={handleClick}
      style={{
        borderLeftColor: todo.color,
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}
    >
      <CardBody>
        <div className='todo-item-card__content'>
          <div className='todo-item-card__text-wrapper'>
            <p className='todo-item-card__text'>{todo.content}</p>

            {todo.completed && (
              <div className='todo-item-card__status'>
                <i className='todo-item-card__check-icon'>✓</i>
                <span className='todo-item-card__status-text'>已完成</span>
              </div>
            )}
          </div>

          {todo.completed && (
            <div className='todo-item-card__completed-badge'>
              <i className='iconfont icon-chenggong'></i>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

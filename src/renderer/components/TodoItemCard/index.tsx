import React from 'react';
import { Card, CardBody } from '../../design-system/components';
import { TodoItem } from '../../api/TODOList/types';
import './index.less';

interface TodoItemCardProps {
  todo: TodoItem;
  compact?: boolean;
}

export default function TodoItemCard(props: TodoItemCardProps): JSX.Element {
  const { todo, compact = true } = props;

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  return (
    <Card
      variant='default'
      padding='none'
      clickable={false}
      hoverable={true}
      className={`todo-item-card ${compact ? 'todo-item-card--compact' : ''}`}
      onClick={handleClick}
      style={{
        borderLeftColor: todo.color,
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}
    >
      <CardBody style={{ padding: 0 }}>
        <div className='todo-item-card__content'>
          <div className='todo-item-card__text-wrapper'>
            <p className='todo-item-card__text'>{todo.content}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

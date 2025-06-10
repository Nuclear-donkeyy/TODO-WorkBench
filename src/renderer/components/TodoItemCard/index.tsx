import React from 'react';
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
    e.stopPropagation(); // 阻止事件冒泡到父级
    onClick?.();
  };

  return (
    <div
      className={`todo-item-card ${compact ? 'compact' : ''} ${todo.completed ? 'completed' : ''}`}
      onClick={handleClick}
      style={{ borderLeftColor: todo.color }}
    >
      <div className='todo-content'>{todo.content}</div>
      {todo.completed && <div className='completed-mark'>✓</div>}
    </div>
  );
}

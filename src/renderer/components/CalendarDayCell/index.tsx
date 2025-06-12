import React from 'react';
import dayjs from 'dayjs';
import { TodoItem } from '../../api/TODOList/types';
import TodoItemCard from '../TodoItemCard';
import './index.less';

interface CalendarDayCellProps {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  todos: TodoItem[];
  onClick: () => void;
}

export default function CalendarDayCell(
  props: CalendarDayCellProps
): JSX.Element {
  const { date, isCurrentMonth, isToday, todos, onClick } = props;

  const dayNumber = dayjs(date).date();
  const maxVisibleTodos = 3;
  const remainingCount = todos.length - maxVisibleTodos;

  return (
    <div
      className={`calendar-day-cell ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
      onClick={onClick}
    >
      <div className='day-header'>
        <span className='day-number'>{dayNumber}</span>
        {todos.length > 0 && <span className='todo-count'>{todos.length}</span>}
      </div>

      <div className='todos-container'>
        {todos.slice(0, maxVisibleTodos).map(todo => (
          <TodoItemCard key={todo.id} todo={todo} compact={true} />
        ))}

        {remainingCount > 0 && (
          <div className='more-todos'>+{remainingCount} 更多</div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted } from '../store/todoSlice';
import TodoItem from './TodoItem';
import './TodoList.less';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state.todos);
  const [inputValue, setInputValue] = useState('');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue.trim()));
      setInputValue('');
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed'): void => {
    dispatch(setFilter(newFilter));
  };

  const handleClearCompleted = (): void => {
    dispatch(clearCompleted());
  };

  return (
    <div className="todo-container">
      <form onSubmit={handleSubmit} className="add-todo-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          autoComplete="off"
        />
        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => handleFilterChange('active')}
        >
          Active ({activeTodosCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed ({completedTodosCount})
        </button>
      </div>

      <div className="todo-list-container">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {filter === 'all' && '🎯 No tasks yet. Add one above!'}
            {filter === 'active' && '✅ No active tasks. Great job!'}
            {filter === 'completed' && '📝 No completed tasks yet.'}
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => dispatch(toggleTodo(todo.id))}
                onDelete={() => dispatch(deleteTodo(todo.id))}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="stats">
        <span className="todo-count">
          {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
        </span>
        {completedTodosCount > 0 && (
          <button onClick={handleClearCompleted} className="clear-btn">
            Clear Completed ({completedTodosCount})
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList; 
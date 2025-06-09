import React, { useState } from 'react';
import { Todo } from '../store/todoSlice';
import './TodoItem.less';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  const handleEdit = (): void => {
    setIsEditing(true);
    setEditValue(todo.text);
  };

  const handleSave = (): void => {
    if (editValue.trim()) {
      // TODO: 添加编辑功能到Redux
      setIsEditing(false);
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setEditValue(todo.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="todo-checkbox"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={handleEdit}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
      </div>
      
      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              onClick={handleEdit}
              className="edit-btn"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="delete-btn"
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      </div>
      
      <div className="todo-meta">
        <small>{new Date(todo.createdAt).toLocaleDateString()}</small>
      </div>
    </li>
  );
};

export default TodoItem; 
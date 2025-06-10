import React from 'react';
import { Empty, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { TodoItem } from '../../api/TODOList/types';
import { API } from '../../api';
import TodoDetailCard from '../TodoDetailCard';
import './index.less';

// 设置dayjs中文locale
dayjs.locale('zh-cn');

interface DayDetailPanelProps {
  date: string;
  todos: TodoItem[];
  onRefresh: () => void;
}

export default function DayDetailPanel(
  props: DayDetailPanelProps
): JSX.Element {
  const { date, todos, onRefresh } = props;

  // 标记任务完成
  const handleComplete = async (todo: TodoItem): Promise<void> => {
    try {
      const response = await API.todo.updateTodo({
        id: todo.id,
        completed: !todo.completed,
      });

      if (response.success) {
        message.success(todo.completed ? '任务已取消完成' : '任务已完成');
        onRefresh();
      } else {
        message.error(response.error || '操作失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 删除任务
  const handleDelete = async (todo: TodoItem): Promise<void> => {
    try {
      const response = await API.todo.deleteTodo(todo.id);

      if (response.success) {
        message.success('任务已删除');
        onRefresh();
      } else {
        message.error(response.error || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  const formatDate = (date: string): string => {
    return dayjs(date).format('MM月DD日 dddd');
  };

  return (
    <div className='day-detail-panel'>
      <div className='panel-header'>
        <h3>{formatDate(date)}</h3>
        <p className='todo-summary'>
          共 {todos.length} 个任务
          {todos.filter(t => t.completed).length > 0 &&
            ` · 已完成 ${todos.filter(t => t.completed).length} 个`}
        </p>
      </div>

      <div className='panel-content'>
        {todos.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='这一天还没有任务'
            style={{ marginTop: 40 }}
          >
            <Button
              type='primary'
              icon={<PlusOutlined />}
              style={{ borderRadius: '8px' }}
            >
              添加任务
            </Button>
          </Empty>
        ) : (
          <div className='todos-list'>
            {todos.map(todo => (
              <TodoDetailCard
                key={todo.id}
                todo={todo}
                onComplete={() => handleComplete(todo)}
                onDelete={() => handleDelete(todo)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

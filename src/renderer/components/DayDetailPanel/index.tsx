import React, { useEffect, useState } from 'react';
import { Empty, Spin } from 'antd';
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
}

export default function DayDetailPanel(
  props: DayDetailPanelProps
): JSX.Element {
  const { date } = props;
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTodos = async (): Promise<void> => {
    setLoading(true);
    console.log(date);
    const response = await API.calendar.getAllTodosByDate(date);
    if (response.success && response.data) {
      setTodos(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const formatDate = (date: string): string => {
    return dayjs(date).format('MM月DD日 dddd');
  };

  return (
    <div className='day-detail-panel'>
      <div className='panel-header'>
        <h3>{formatDate(date)}</h3>
        <p className='todo-summary'>共 {todos.length} 个任务</p>
      </div>

      <div className='panel-content'>
        {loading ? (
          <Spin />
        ) : todos.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='这一天还没有任务'
            style={{ marginTop: 40 }}
          ></Empty>
        ) : (
          <div className='todos-list'>
            {todos.map(todo => (
              <TodoDetailCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

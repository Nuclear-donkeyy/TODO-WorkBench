import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import CalendarDayCell from '../CalendarDayCell';
import './index.less';
import API from '@/renderer/api';
import { TodoItem } from '@/renderer/api/TODOList/types';

interface CalendarGridProps {
  currentDate: Dayjs;
  onDateClick: (date: string) => void;
}

interface Date2TodoMap {
  [key: string]: TodoItem[];
}

export default function CalendarGrid(props: CalendarGridProps): JSX.Element {
  const { currentDate, onDateClick } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [date2todoMap, setDate2todoMap] = useState<Date2TodoMap>({});
  const [calendarDays, setCalendarDays] = useState<string[]>([]);
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  let endOfCalendar = endOfMonth.endOf('week');
  if (endOfCalendar.diff(startOfCalendar, 'day') < 41) {
    endOfCalendar = endOfCalendar.add(1, 'week');
  }
  // 生成日历中的所有日期
  const generateCalendarDays = (): void => {
    const days: string[] = [];
    let current = startOfCalendar;

    while (
      current.isBefore(endOfCalendar) ||
      current.isSame(endOfCalendar, 'day')
    ) {
      const dateString = current.format('YYYY-MM-DD');
      days.push(dateString);
      current = current.add(1, 'day');
    }
    setCalendarDays(days);
  };

  const fetchTodos = async (): Promise<void> => {
    setLoading(true);
    generateCalendarDays();
    const response = await API.calendar.getAllTodosByMonth(
      currentDate.format('YYYY-MM-DD').slice(0, 7)
    );
    const _date2todoMap: Date2TodoMap = {};
    if (response.success && response.data) {
      response.data.forEach(item => {
        if (item.endDate) {
          const dateKey = item.endDate.slice(5, 10); // MM-DD format
          _date2todoMap[dateKey] = _date2todoMap[dateKey]
            ? [..._date2todoMap[dateKey], item]
            : [item];
        }
      });
    }
    setDate2todoMap(_date2todoMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, [currentDate]);

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className='calendar-grid'>
      {/* 星期标题 */}
      <div className='week-header'>
        {weekDays.map(day => (
          <div key={day} className='week-day'>
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 */}
      <div className='calendar-body'>
        {loading ? (
          <div className='loading-container'>
            <Spin size='large' tip='加载中...' />
          </div>
        ) : (
          <div className='calendar-cells'>
            {calendarDays.map(date => {
              const dayjs_date = dayjs(date);
              const isCurrentMonth = dayjs_date.month() === currentDate.month();
              const isToday = dayjs_date.isSame(dayjs(), 'day');
              const todos = date2todoMap[date.slice(5, 10)] || [];
              return (
                <CalendarDayCell
                  key={date}
                  date={date}
                  isCurrentMonth={isCurrentMonth}
                  isToday={isToday}
                  todos={todos}
                  onClick={() => onDateClick(date)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

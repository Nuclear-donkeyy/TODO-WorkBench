import React from 'react';
import { Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { TodoItem } from '../../api/TODOList/types';
import CalendarDayCell from '../CalendarDayCell';
import './index.less';

interface CalendarGridProps {
  currentDate: Dayjs;
  getTodosForDate: (date: string) => TodoItem[];
  onDateClick: (date: string) => void;
  loading: boolean;
}

export default function CalendarGrid(props: CalendarGridProps): JSX.Element {
  const { currentDate, getTodosForDate, onDateClick, loading } = props;

  // 获取当月的第一天和最后一天
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');

  // 获取日历显示的第一天（可能是上个月的最后几天）
  const startOfCalendar = startOfMonth.startOf('week');

  // 获取日历显示的最后一天（可能是下个月的前几天）
  const endOfCalendar = endOfMonth.endOf('week');

  // 生成日历中的所有日期
  const generateCalendarDays = (): string[] => {
    const days: string[] = [];
    let current = startOfCalendar;

    while (
      current.isBefore(endOfCalendar) ||
      current.isSame(endOfCalendar, 'day')
    ) {
      days.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

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
              const todos = getTodosForDate(date);

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

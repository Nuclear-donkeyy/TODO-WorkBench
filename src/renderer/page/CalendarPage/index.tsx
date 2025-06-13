import React, { useState } from 'react';
import { Select, Drawer } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/zh-cn';

// 启用dayjs插件
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale('zh-cn');

import CalendarGrid from '../../components/CalendarGrid';
import DayDetailPanel from '../../components/DayDetailPanel';
import './index.less';

const { Option } = Select;

export default function CalendarPage(): JSX.Element {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 年份选项（当前年份前后各3年）
  const currentYear = dayjs().year();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  // 月份选项
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // 年份改变
  const handleYearChange = (year: number): void => {
    setCurrentDate(currentDate.year(year));
  };

  // 月份改变
  const handleMonthChange = (month: number): void => {
    setCurrentDate(currentDate.month(month - 1));
  };

  // 点击日期格子
  const handleDateClick = (date: string): void => {
    setSelectedDate(date);
    setDrawerVisible(true);
  };

  // 关闭抽屉
  const handleDrawerClose = (): void => {
    setDrawerVisible(false);
    setSelectedDate(null);
  };

  return (
    <div className='calendar-page'>
      <div className='calendar-header'>
        <h1>日历视图</h1>
        <div className='date-selectors'>
          <Select
            value={currentDate.year()}
            onChange={handleYearChange}
            style={{ width: 100, marginRight: 16 }}
          >
            {yearOptions.map(year => (
              <Option key={year} value={year}>
                {year}年
              </Option>
            ))}
          </Select>
          <Select
            value={currentDate.month() + 1}
            onChange={handleMonthChange}
            style={{ width: 80 }}
          >
            {monthOptions.map(month => (
              <Option key={month} value={month}>
                {month}月
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className='calendar-content'>
        <CalendarGrid currentDate={currentDate} onDateClick={handleDateClick} />
      </div>

      <Drawer
        title={
          selectedDate
            ? `${dayjs(selectedDate).format('YYYY年MM月DD日')} 的任务`
            : '任务详情'
        }
        placement='right'
        width={400}
        open={drawerVisible}
        onClose={handleDrawerClose}
        className='day-detail-drawer'
      >
        {selectedDate && <DayDetailPanel date={selectedDate} />}
      </Drawer>
    </div>
  );
}

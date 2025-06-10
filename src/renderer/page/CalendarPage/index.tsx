import React from 'react';
import type { CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import './index.less';

interface IDayInfo {
  type: string;
  content: string;
}

const getListData = (value: Dayjs): IDayInfo[] => {
  let listData: IDayInfo[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.hhhhhhhhhhhhh' },
        { type: 'warning', content: 'This is warning event.hhhhhhhhhhhhh' },
      ];
      break;
    case 10:
      listData = [{ type: 'warning', content: 'This is warning event.' }];
      break;
    case 15:
      listData = [{ type: 'warning', content: 'This is warning event' }];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs): number | undefined => {
  if (value.month() === 8) {
    return 1394;
  } else {
    return undefined;
  }
};

const CalendarPage: React.FC = () => {
  const monthCellRender = (value: Dayjs): JSX.Element | null => {
    const num = getMonthData(value);
    return num ? (
      <div className='notes-month'>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs): JSX.Element => {
    const listData = getListData(value);
    return (
      <ul className='events'>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={'processing'} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div className='calendar-page-container'>
      <Calendar cellRender={cellRender} />
    </div>
  );
};

export default CalendarPage;

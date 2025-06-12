import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardBody } from '../../design-system/components';
import './index.less';

export interface CompletionChartProps {
  title: string;
  completedTasks: number;
  totalTasks: number;
  colors?: {
    completed: string;
    pending: string;
  };
  showLegend?: boolean;
  showTooltip?: boolean;
}

const defaultColors = {
  completed: '#00d4aa',
  pending: '#e2e8f0',
};

export default function CompletionChart(
  props: CompletionChartProps
): JSX.Element {
  const {
    title,
    completedTasks,
    totalTasks,
    colors = defaultColors,
    showLegend = true,
    showTooltip = true,
  } = props;

  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const data = [
    {
      name: '已完成',
      value: completedTasks,
      color: colors.completed,
      percentage: completionRate,
    },
    {
      name: '未完成',
      value: pendingTasks,
      color: colors.pending,
      percentage: 100 - completionRate,
    },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='completion-chart__tooltip'>
          <p className='completion-chart__tooltip-label'>{data.name}</p>
          <p className='completion-chart__tooltip-value'>数量: {data.value}</p>
          <p className='completion-chart__tooltip-percentage'>
            占比: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className='completion-chart__custom-legend'>
        {payload.map((entry: any, index: number) => (
          <div key={index} className='completion-chart__legend-item'>
            <span
              className='completion-chart__legend-dot'
              style={{ backgroundColor: entry.color }}
            />
            <span className='completion-chart__legend-text'>{entry.value}</span>
            <span className='completion-chart__legend-count'>
              ({entry.payload.value})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card
      variant='elevated'
      padding='md'
      hoverable
      className='completion-chart'
    >
      <CardBody>
        <div className='completion-chart__content'>
          <h3 className='completion-chart__title'>{title}</h3>

          <div className='completion-chart__summary'>
            <div className='completion-chart__rate'>
              <span className='completion-chart__rate-value'>
                {completionRate}%
              </span>
              <span className='completion-chart__rate-label'>完成率</span>
            </div>
            <div className='completion-chart__stats'>
              <span className='completion-chart__stats-text'>
                {completedTasks}/{totalTasks} 已完成
              </span>
            </div>
          </div>

          <div className='completion-chart__chart-container'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  stroke='none'
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {showLegend && <Legend content={<CustomLegend />} />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardBody } from '../../design-system/components';
import './index.less';

export interface ProgressRingProps {
  title: string;
  percentage: number;
  total?: number;
  completed?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function ProgressRing(props: ProgressRingProps): JSX.Element {
  const {
    title,
    percentage,
    total,
    completed,
    color = 'var(--color-primary)',
    size = 'md',
    showDetails = true,
  } = props;

  const data = [
    { name: 'completed', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ];

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return { width: 120, height: 120, innerRadius: 35, outerRadius: 50 };
      case 'lg':
        return { width: 200, height: 200, innerRadius: 65, outerRadius: 85 };
      default:
        return { width: 160, height: 160, innerRadius: 50, outerRadius: 70 };
    }
  };

  const sizeConfig = getSizeConfig();

  return (
    <Card
      variant='elevated'
      padding='md'
      hoverable
      className={`progress-ring progress-ring--${size}`}
    >
      <CardBody>
        <div className='progress-ring__content'>
          <h3 className='progress-ring__title'>{title}</h3>

          <div className='progress-ring__chart-container'>
            <ResponsiveContainer width='100%' height={sizeConfig.height}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey='value'
                  startAngle={90}
                  endAngle={450}
                  innerRadius={sizeConfig.innerRadius}
                  outerRadius={sizeConfig.outerRadius}
                  stroke='none'
                >
                  <Cell fill={color} />
                  <Cell fill='var(--color-neutral-200)' />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className='progress-ring__center'>
              <div className='progress-ring__percentage'>{percentage}%</div>
              {showDetails &&
                total !== undefined &&
                completed !== undefined && (
                  <div className='progress-ring__details'>
                    {completed}/{total}
                  </div>
                )}
            </div>
          </div>

          {showDetails && (
            <div className='progress-ring__legend'>
              <div className='progress-ring__legend-item'>
                <span
                  className='progress-ring__legend-dot'
                  style={{ backgroundColor: color }}
                ></span>
                <span className='progress-ring__legend-text'>
                  任务进度: {percentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

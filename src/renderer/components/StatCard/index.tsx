import React from 'react';
import { Card, CardBody } from '../../design-system/components';
import './index.less';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  suffix?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export default function StatCard(props: StatCardProps): JSX.Element {
  const {
    title,
    value,
    icon,
    color = 'var(--color-primary)',
    suffix,
    trend,
  } = props;

  return (
    <Card
      variant='elevated'
      padding='none'
      hoverable
      className={`stat-card`}
      style={{ borderTop: `4px solid ${color}` }}
    >
      <CardBody>
        <div className='stat-card__content'>
          <div className='stat-card__header'>
            <span className='stat-card__title'>{title}</span>
            {icon && (
              <div className='stat-card__icon' style={{ color }}>
                {icon}
              </div>
            )}
          </div>

          <div className='stat-card__value-section'>
            <div className='stat-card__value'>
              {value}
              {suffix && <span className='stat-card__suffix'>{suffix}</span>}
            </div>

            {trend && (
              <div
                className={`stat-card__trend ${trend.isUp ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}
              >
                <span className='stat-card__trend-icon'>
                  {trend.isUp ? '↗' : '↙'}
                </span>
                <span className='stat-card__trend-value'>
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

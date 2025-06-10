import React, { forwardRef } from 'react';
import './Card.less';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  children?: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'ds-card';
    const variantClass = `ds-card--${variant}`;
    const paddingClass = `ds-card--padding-${padding}`;
    const stateClasses = [
      hoverable && 'ds-card--hoverable',
      clickable && 'ds-card--clickable',
    ]
      .filter(Boolean)
      .join(' ');

    const classes = [
      baseClasses,
      variantClass,
      paddingClass,
      stateClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card子组件
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`ds-card__header ${className}`} {...props}>
    {children}
  </div>
));

export const CardBody = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`ds-card__body ${className}`} {...props}>
    {children}
  </div>
));

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`ds-card__footer ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;

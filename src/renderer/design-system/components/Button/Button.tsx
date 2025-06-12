import React, { forwardRef } from 'react';
import './Button.less';

// Button变体类型
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'ds-button';
    const variantClass = `ds-button--${variant}`;
    const sizeClass = `ds-button--${size}`;
    const stateClasses = [
      loading && 'ds-button--loading',
      fullWidth && 'ds-button--full-width',
      disabled && 'ds-button--disabled',
    ]
      .filter(Boolean)
      .join(' ');

    const classes = [
      baseClasses,
      variantClass,
      sizeClass,
      stateClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const hasIcon = icon && !loading;
    const showChildren = children && !loading;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className='ds-button__spinner' />}

        {hasIcon && iconPosition === 'left' && (
          <span className='ds-button__icon ds-button__icon--left'>{icon}</span>
        )}

        {showChildren && <span className='ds-button__content'>{children}</span>}

        {hasIcon && iconPosition === 'right' && (
          <span className='ds-button__icon ds-button__icon--right'>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

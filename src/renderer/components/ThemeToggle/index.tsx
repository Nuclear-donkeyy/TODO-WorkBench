import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import './index.less';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { theme, toggleTheme, themes } = useTheme();
  const isDark = theme === 'dark';
  const currentThemeConfig = themes[theme];

  return (
    <button
      className={`theme-toggle theme-toggle--${size} ${className}`}
      onClick={toggleTheme}
      title={`切换到${isDark ? '亮色' : '暗色'}主题`}
      aria-label={`当前主题: ${currentThemeConfig.name}, 点击切换`}
    >
      <div className='theme-toggle__icon'>
        {isDark ? (
          // 太阳图标 (亮色模式)
          <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
            <circle
              cx='10'
              cy='10'
              r='3.5'
              stroke='currentColor'
              strokeWidth='1.5'
            />
            <path
              d='M10 1v2M10 17v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M1 10h2M17 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        ) : (
          // 月亮图标 (暗色模式)
          <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
            <path
              d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        )}
      </div>

      {showLabel && (
        <span className='theme-toggle__label'>{currentThemeConfig.name}</span>
      )}
    </button>
  );
};

export default ThemeToggle;

import React from 'react';
import { Spin } from 'antd';
import './index.less';

// 全局系统加载界面
export const SystemLoading: React.FC = () => {
  return (
    <div className='system-loading'>
      <div className='loading-content'>
        <div className='logo-container'>
          <div className='logo-icon'>
            <div className='check-circle'>
              <div className='check-mark'>✓</div>
            </div>
          </div>
          <h1 className='app-title'>TODO WorkBench</h1>
          <p className='app-subtitle'>打卡管理系统</p>
        </div>

        <div className='loading-animation'>
          <div className='loading-dots'>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>
          </div>
          <p className='loading-text'>系统加载中...</p>
        </div>
      </div>
    </div>
  );
};

// 页面级别加载
interface PageLoadingProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  tip = '加载中...',
  size = 'large',
}) => {
  return (
    <div className='page-loading'>
      <div className='page-loading-content'>
        <Spin size={size} />
        <p className='loading-tip'>{tip}</p>
      </div>
    </div>
  );
};

// 内容加载骨架屏
interface SkeletonLoadingProps {
  type?: 'card' | 'list' | 'grid';
  rows?: number;
  showAvatar?: boolean;
}

export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  type = 'card',
  rows = 3,
  showAvatar = true,
}) => {
  const renderCardSkeleton = () => (
    <div className='skeleton-card'>
      <div className='skeleton-header'>
        {showAvatar && <div className='skeleton-avatar'></div>}
        <div className='skeleton-title'></div>
      </div>
      <div className='skeleton-content'>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className='skeleton-line'
            style={{ width: `${100 - index * 10}%` }}
          ></div>
        ))}
      </div>
      <div className='skeleton-footer'>
        <div className='skeleton-button'></div>
        <div className='skeleton-button small'></div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className='skeleton-list'>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className='skeleton-list-item'>
          {showAvatar && <div className='skeleton-avatar small'></div>}
          <div className='skeleton-content'>
            <div className='skeleton-title short'></div>
            <div className='skeleton-line'></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridSkeleton = () => (
    <div className='skeleton-grid'>
      {Array.from({ length: rows * 3 }).map((_, index) => (
        <div key={index} className='skeleton-grid-item'>
          <div className='skeleton-image'></div>
          <div className='skeleton-title'></div>
          <div className='skeleton-line'></div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return renderListSkeleton();
      case 'grid':
        return renderGridSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return <div className='skeleton-loading'>{renderSkeleton()}</div>;
};

// 小型加载指示器
interface MiniLoadingProps {
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
}

export const MiniLoading: React.FC<MiniLoadingProps> = ({
  tip,
  spinning = true,
  children,
}) => {
  return (
    <Spin spinning={spinning} tip={tip} size='small'>
      {children}
    </Spin>
  );
};

// 按钮加载状态
interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  loading = false,
  children,
  onClick,
  className = '',
}) => {
  return (
    <button
      className={`button-loading ${className} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading && (
        <span className='button-spinner'>
          <div className='spinner'></div>
        </span>
      )}
      <span className={`button-content ${loading ? 'hidden' : ''}`}>
        {children}
      </span>
    </button>
  );
};

// 导出所有组件
export default {
  SystemLoading,
  PageLoading,
  SkeletonLoading,
  MiniLoading,
  ButtonLoading,
};

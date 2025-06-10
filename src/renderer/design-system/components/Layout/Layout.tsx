import React, { forwardRef } from 'react';
import './Layout.less';

// 主布局组件
export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ direction = 'horizontal', className = '', children, ...props }, ref) => {
    const classes = ['ds-layout', `ds-layout--${direction}`, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

// 侧边栏组件
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  position?: 'left' | 'right';
  collapsible?: boolean;
  collapsed?: boolean;
  children?: React.ReactNode;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      width = 280,
      position = 'left',
      collapsible = false,
      collapsed = false,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const classes = [
      'ds-sidebar',
      `ds-sidebar--${position}`,
      collapsible && 'ds-sidebar--collapsible',
      collapsed && 'ds-sidebar--collapsed',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const sidebarStyle = {
      width: collapsed
        ? 'auto'
        : typeof width === 'number'
          ? `${width}px`
          : width,
      ...style,
    };

    return (
      <aside ref={ref} className={classes} style={sidebarStyle} {...props}>
        <div className='ds-sidebar__content'>{children}</div>
      </aside>
    );
  }
);

// 主内容区域组件
export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ padding = 'md', className = '', children, ...props }, ref) => {
    const classes = ['ds-content', `ds-content--padding-${padding}`, className]
      .filter(Boolean)
      .join(' ');

    return (
      <main ref={ref} className={classes} {...props}>
        {children}
      </main>
    );
  }
);

// 头部组件
export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  fixed?: boolean;
  children?: React.ReactNode;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    { height = 64, fixed = false, className = '', children, style, ...props },
    ref
  ) => {
    const classes = ['ds-header', fixed && 'ds-header--fixed', className]
      .filter(Boolean)
      .join(' ');

    const headerStyle = {
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    return (
      <header ref={ref} className={classes} style={headerStyle} {...props}>
        <div className='ds-header__content'>{children}</div>
      </header>
    );
  }
);

// 底部组件
export interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  fixed?: boolean;
  children?: React.ReactNode;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
  (
    {
      height = 'auto',
      fixed = false,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const classes = ['ds-footer', fixed && 'ds-footer--fixed', className]
      .filter(Boolean)
      .join(' ');

    const footerStyle = {
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    return (
      <footer ref={ref} className={classes} style={footerStyle} {...props}>
        <div className='ds-footer__content'>{children}</div>
      </footer>
    );
  }
);

Layout.displayName = 'Layout';
Sidebar.displayName = 'Sidebar';
Content.displayName = 'Content';
Header.displayName = 'Header';
Footer.displayName = 'Footer';

export { Layout, Sidebar, Content, Header, Footer };
export default Layout;

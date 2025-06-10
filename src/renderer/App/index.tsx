import './index.less';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuItem, { type MenuItemProp } from '../components/MenuItem';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import useWindowSize from '../hooks/useWindowSize';

export default function App(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useWindowSize();

  // 路由映射
  const routeMap: Record<string, string> = {
    待办事项: 'todoList',
    日历: 'calendar',
    记事本: 'notebook',
    打卡: 'checkList',
    计划: 'planning',
    设置: 'setting',
  };

  // 响应窗口大小变化
  useEffect(() => {
    // 当窗口大小变化时，可以在这里进行一些布局调整
    console.log('窗口大小变化:', windowSize);

    // 确保文档元素能够正确适应窗口大小
    const root = document.getElementById('root');
    if (root) {
      root.style.width = '100%';
      root.style.height = '100vh';
    }

    // 强制重新计算布局
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
  }, [windowSize]);

  // 菜单项配置，使用navigate进行路由跳转
  const menuItemProps: MenuItemProp[] = [
    {
      name: '待办事项',
      icon: 'icon-daibanrenwu',
      cnt: 3,
      callback: () => navigate(routeMap['待办事项']),
    },
    {
      name: '日历',
      icon: 'icon-rili',
      callback: () => navigate(routeMap['日历']),
    },
    {
      name: '记事本',
      icon: 'icon-jishiben',
      callback: () => navigate(routeMap['记事本']),
    },
    {
      name: '打卡',
      icon: 'icon-daka',
      callback: () => navigate(routeMap['打卡']),
    },
    {
      name: '计划',
      icon: 'icon-daka',
      callback: () => navigate(routeMap['计划']),
    },
    {
      name: '设置',
      icon: 'icon-daka',
      callback: () => navigate(routeMap['设置']),
    },
  ];

  return (
    <div
      className='app-container'
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <div className='leftSide-bar'>
        {menuItemProps.map((item, index) => {
          // 检查当前路由是否匹配
          const currentRoute = routeMap[item.name];
          const isActive =
            location.pathname === `/${currentRoute}` ||
            (location.pathname === '/' && currentRoute === 'todoList'); // 默认路由

          return (
            <MenuItem
              name={item.name}
              icon={item.icon}
              {...(item.cnt !== undefined && { cnt: item.cnt })}
              key={index}
              callback={item.callback}
              isActive={isActive}
            />
          );
        })}
      </div>
      <div className='content-container'>
        <Outlet />
      </div>
    </div>
  );
}

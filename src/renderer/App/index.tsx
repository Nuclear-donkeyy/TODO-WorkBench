import './index.less';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Layout,
  Sidebar,
  Content,
} from '../design-system/components/Layout/Layout';
import MenuItem, { type MenuItemProp } from '../components/MenuItem';
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
    测试: 'test',
  };

  // 响应窗口大小变化
  useEffect(() => {
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
    {
      name: '测试',
      icon: 'icon-daka',
      callback: () => navigate(routeMap['测试']),
    },
  ];

  return (
    <Layout direction='horizontal' className='app-layout'>
      <Sidebar width={280} position='left' className='app-sidebar'>
        <div className='app-sidebar__header'>
          <h1 className='app-title'>TODO WorkBench</h1>
          <p className='app-subtitle'>高效任务管理工具</p>
        </div>

        <nav className='app-navigation'>
          {menuItemProps.map((item, index) => {
            // 检查当前路由是否匹配
            const currentRoute = routeMap[item.name];
            const isActive =
              location.pathname === `/${currentRoute}` ||
              (location.pathname === '/' && currentRoute === 'todoList'); // 默认路由

            return (
              <MenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                {...(item.cnt !== undefined && { cnt: item.cnt })}
                callback={item.callback}
                isActive={isActive}
              />
            );
          })}
        </nav>
      </Sidebar>

      <Content padding='lg' className='app-content'>
        <div className='app-content__wrapper'>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

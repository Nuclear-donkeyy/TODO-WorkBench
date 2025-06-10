import './index.less';
import { useNavigate } from 'react-router-dom';
import MenuItem, { type MenuItemProp } from '../components/MenuItem';
import { Outlet } from 'react-router-dom';

export default function App(): JSX.Element {
  const navigate = useNavigate();

  // 路由映射
  const routeMap: Record<string, string> = {
    待办事项: 'todoList',
    日历: 'calendar',
    记事本: 'notebook',
    打卡: 'checkList',
    设置: 'setting',
  };

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
      name: '设置',
      icon: 'icon-daka',
      callback: () => navigate(routeMap['设置']),
    },
  ];
  return (
    <div className='app-container'>
      <div className='leftSide-bar'>
        {menuItemProps.map((item, index) => {
          return (
            <MenuItem
              name={item.name}
              icon={item.icon}
              {...(item.cnt !== undefined && { cnt: item.cnt })}
              key={index}
              callback={item.callback}
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

import './index.less';
import MenuItem, { type MenuItemProp } from '../components/MenuItem';
const menuItemProps: MenuItemProp[] = [
  { name: '待办事项', icon: 'icon-daibanrenwu', cnt: 3 },
  { name: '日历', icon: 'icon-rili' },
  { name: '记事本', icon: 'icon-jishiben' },
  { name: '打卡', icon: 'icon-daka' },
  { name: '设置', icon: 'icon-daka' },
];

export default function App(): JSX.Element {
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
            />
          );
        })}
      </div>
      <div className='content-container'></div>
    </div>
  );
}

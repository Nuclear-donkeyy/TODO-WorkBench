import React from 'react';
import { Card } from '../../design-system/components';
import './index.less';

export interface MenuItemProp {
  name: string;
  icon: string;
  cnt?: number;
  callback: () => void;
  isActive?: boolean;
}

export default function MenuItem(props: MenuItemProp): JSX.Element {
  const { name, icon, cnt, isActive = false, callback } = props;

  return (
    <Card
      variant={isActive ? 'elevated' : 'ghost'}
      padding='sm'
      clickable
      hoverable={!isActive}
      className={`menu-item ${isActive ? 'menu-item--active' : ''}`}
      onClick={callback}
    >
      <div className='menu-item__content'>
        <div className='menu-item__icon-wrapper'>
          <i className={`iconfont ${icon} menu-item__icon`} />
        </div>

        <h3 className='menu-item__title'>{name}</h3>

        {cnt !== undefined && cnt > 0 && (
          <div className='menu-item__badge'>{cnt}</div>
        )}
      </div>
    </Card>
  );
}

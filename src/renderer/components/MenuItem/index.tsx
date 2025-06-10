import './index.less';

export interface MenuItemProp {
  name: string;
  icon: string;
  cnt?: number;
  callback: () => void;
  isActive?: boolean;
}

export default function MenuItem(props: MenuItemProp): JSX.Element {
  const { name, icon, isActive = false } = props;
  return (
    <div
      className={`item-container ${isActive ? 'active' : ''}`}
      onClick={props.callback}
    >
      <i className={`iconfont ${icon}`} />
      <h2>{name}</h2>
      {props.cnt && <div className='cnt-dot'>{props.cnt}</div>}
    </div>
  );
}

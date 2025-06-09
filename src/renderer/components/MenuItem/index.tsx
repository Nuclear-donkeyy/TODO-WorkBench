import './index.less';

export interface MenuItemProp {
  name: string;
  icon: string;
  cnt?: number;
}

export default function MenuItem(props: MenuItemProp): JSX.Element {
  const { name, icon } = props;
  return (
    <div className='item-container'>
      <i className={`iconfont ${icon}`} />
      <h2>{name}</h2>
      {props.cnt && <div className='cnt-dot'>{props.cnt}</div>}
    </div>
  );
}

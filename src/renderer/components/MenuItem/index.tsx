import './index.less';

export interface MenuItemProp {
  name: string;
  icon: string;
  cnt?: number;
  callback: () => void;
}

export default function MenuItem(props: MenuItemProp): JSX.Element {
  const { name, icon } = props;
  return (
    <div className='item-container' onClick={props.callback}>
      <i className={`iconfont ${icon}`} />
      <h2>{name}</h2>
      {props.cnt && <div className='cnt-dot'>{props.cnt}</div>}
    </div>
  );
}

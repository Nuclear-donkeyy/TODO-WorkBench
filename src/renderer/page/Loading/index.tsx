import './index.less';
export default function Loading(): JSX.Element {
  return (
    <div className='loading-container'>
      <div className='loading-bar'></div>
      <div className='loading-bar'></div>
      <div className='loading-bar'></div>
    </div>
  );
}

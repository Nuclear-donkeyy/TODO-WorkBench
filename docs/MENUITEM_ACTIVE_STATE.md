# MenuItem 激活状态保持功能

## 功能描述
实现了 MenuItem 组件的激活状态保持功能，当用户点击菜单项后，会保留悬停时的 transform 效果，直到切换到其他菜单项。

## 实现细节

### 1. CSS 样式实现 (MenuItem/index.less)

```less
.item-container {
  // 悬停效果
  &:hover::after {
    transform: scaleX(1);
    transform-origin: right;
    transition: transform 0.5s;
  }

  // 激活状态效果
  &.active::after {
    transform: scaleX(1);
    transform-origin: left;
    transition: transform 0.5s;
  }

  &.active {
    box-shadow: @box-shadow-md-light-scheme;
  }

  // 背景动画伪元素
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--accent-color);
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.5s ease-in-out;
    z-index: -1;
  }
}
```

**关键设计：**
- **悬停状态**: `transform-origin: right` - 从右侧展开
- **激活状态**: `transform-origin: left` - 从左侧保持
- **流畅过渡**: 使用 `ease-in-out` 缓动函数

### 2. React 组件接口扩展 (MenuItem/index.tsx)

```typescript
export interface MenuItemProp {
  name: string;
  icon: string;
  cnt?: number;
  callback: () => void;
  isActive?: boolean; // 新增激活状态属性
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
```

### 3. 路由状态管理 (App/index.tsx)

```typescript
import { useNavigate, useLocation } from 'react-router-dom';

export default function App(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路由

  // 路由映射
  const routeMap: Record<string, string> = {
    待办事项: 'todoList',
    日历: 'calendar',
    记事本: 'notebook',
    打卡: 'checkList',
    计划: 'planning',
    设置: 'setting',
  };

  return (
    <div className='leftSide-bar'>
      {menuItemProps.map((item, index) => {
        // 检查当前路由是否匹配
        const currentRoute = routeMap[item.name];
        const isActive = 
          location.pathname === `/${currentRoute}` || 
          (location.pathname === '/' && currentRoute === 'todoList');
        
        return (
          <MenuItem
            name={item.name}
            icon={item.icon}
            callback={item.callback}
            isActive={isActive} // 传递激活状态
            key={index}
          />
        );
      })}
    </div>
  );
}
```

## 视觉效果

### 交互状态
1. **默认状态**: 无背景色，白色文字和图标
2. **悬停状态**: 
   - 薄荷绿背景从右侧滑入 (`transform-origin: right`)
   - 添加阴影效果
3. **激活状态**: 
   - 薄荷绿背景从左侧保持 (`transform-origin: left`)
   - 持续显示阴影效果
   - 状态保持直到切换到其他菜单项

### 动画细节
- **持续时间**: 0.5秒
- **缓动函数**: `ease-in-out`
- **变换原点**: 悬停时从右侧，激活时从左侧
- **背景色**: 使用主题薄荷绿色 `var(--accent-color)`

## 技术特点

### 1. 响应式状态管理
- 基于 React Router 的 `useLocation` hook
- 自动检测当前路由并高亮对应菜单项
- 支持默认路由 (`/` 对应待办事项)

### 2. 平滑动画过渡
- CSS transform 实现高性能动画
- 不同状态使用不同的变换原点
- 避免布局重排和重绘

### 3. 主题集成
- 使用 CSS 变量实现主题一致性
- 与整体设计系统无缝集成
- 支持未来的主题切换功能

## 使用方法

### 基本使用
菜单项会自动根据当前路由显示激活状态，无需手动控制。

### 路由映射
在 `App/index.tsx` 中的 `routeMap` 对象定义菜单名称到路由的映射关系。

### 自定义激活逻辑
可以通过修改 `isActive` 的判断逻辑来自定义激活条件：

```typescript
const isActive = 
  location.pathname === `/${currentRoute}` || 
  location.pathname.startsWith(`/${currentRoute}/`) || // 支持子路由
  (location.pathname === '/' && currentRoute === 'todoList');
```

## 兼容性说明

- 兼容所有现代浏览器
- 支持 Electron 环境
- CSS3 Transform 和 Transition 支持
- React Router v6 兼容

## 未来优化方向

1. **动画增强**: 添加更多动画细节，如图标变色等
2. **主题支持**: 根据不同主题调整激活色彩
3. **无障碍支持**: 添加 ARIA 属性和键盘导航
4. **性能优化**: 使用 CSS containment 优化重绘性能 
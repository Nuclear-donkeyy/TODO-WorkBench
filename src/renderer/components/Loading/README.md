# 统一加载系统

这是一个完整的、统一的加载界面系统，提供了多种加载状态和组件。

## 组件列表

### 1. SystemLoading - 系统级加载界面
用于应用启动时的全屏加载。

```tsx
import { SystemLoading } from '../../components/Loading';

// 显示系统加载界面
<SystemLoading />
```

### 2. PageLoading - 页面级加载
用于页面或大块内容的加载。

```tsx
import { PageLoading } from '../../components/Loading';

// 基础用法
<PageLoading />

// 自定义提示和大小
<PageLoading tip="数据加载中..." size="large" />
```

### 3. SkeletonLoading - 骨架屏
用于内容加载时的占位符。

```tsx
import { SkeletonLoading } from '../../components/Loading';

// 卡片样式骨架屏
<SkeletonLoading type="card" rows={3} showAvatar={true} />

// 列表样式骨架屏
<SkeletonLoading type="list" rows={5} showAvatar={false} />

// 网格样式骨架屏
<SkeletonLoading type="grid" rows={2} />
```

### 4. MiniLoading - 小型加载指示器
用于包装小块内容的加载状态。

```tsx
import { MiniLoading } from '../../components/Loading';

<MiniLoading spinning={loading} tip="处理中...">
  <div>需要加载状态的内容</div>
</MiniLoading>
```

### 5. ButtonLoading - 按钮加载状态
自定义的按钮加载组件。

```tsx
import { ButtonLoading } from '../../components/Loading';

<ButtonLoading 
  loading={isSubmitting} 
  onClick={handleSubmit}
  className="custom-btn"
>
  提交
</ButtonLoading>
```

## Hook - useLoading

统一的加载状态管理Hook。

```tsx
import { useLoading, LoadingKeys } from '../../hooks/useLoading';

const MyComponent = () => {
  const { isLoading, withLoading } = useLoading();

  // 包装异步函数，自动管理加载状态
  const handleSubmit = withLoading(LoadingKeys.SUBMIT, async (data) => {
    // 异步操作
    await submitData(data);
  });

  return (
    <Button 
      loading={isLoading(LoadingKeys.SUBMIT)}
      onClick={handleSubmit}
    >
      提交
    </Button>
  );
};
```

### 预定义的LoadingKeys

```tsx
LoadingKeys.SYSTEM    // 系统级加载
LoadingKeys.PAGE      // 页面加载
LoadingKeys.SUBMIT    // 提交操作
LoadingKeys.DELETE    // 删除操作
LoadingKeys.FETCH     // 数据获取
LoadingKeys.CHECKIN   // 打卡操作
LoadingKeys.RESET     // 重置操作
```

## 全局加载提供者

```tsx
import { LoadingProvider, useGlobalLoading } from '../../components/Loading/LoadingProvider';

// 在应用根组件中使用
<LoadingProvider>
  <App />
</LoadingProvider>

// 在子组件中控制全局加载
const { setShowSystemLoading } = useGlobalLoading();

// 显示系统级加载
setShowSystemLoading(true);
```

## 设计原则

1. **统一性**: 所有加载状态使用相同的设计语言和动画
2. **层次性**: 不同级别的加载适用于不同的场景
3. **可定制**: 支持自定义样式和参数
4. **性能优化**: 使用CSS动画，避免JS动画
5. **响应式**: 适配不同屏幕尺寸

## 样式定制

所有组件都支持通过CSS变量进行主题定制：

```less
// 在你的less文件中覆盖变量
:root {
  --primary-color: #your-color;
  --accent-color: #your-accent;
  // 其他变量...
}
```

## 最佳实践

1. **系统启动**: 使用 `SystemLoading`
2. **页面切换**: 使用 `PageLoading`
3. **数据加载**: 使用 `SkeletonLoading`
4. **按钮操作**: 使用按钮的 `loading` 属性
5. **表单提交**: 使用 `useLoading` Hook 管理状态
6. **长时间操作**: 组合使用多种加载状态 
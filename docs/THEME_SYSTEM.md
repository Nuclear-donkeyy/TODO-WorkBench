# 🎨 多主题系统使用指南

## 概述

TODO WorkBench 现在支持 6 种不同的主题色彩方案，包括 5 种亮色主题和 1 种暗色主题，让用户可以根据个人喜好和使用环境选择最适合的视觉风格。

## 主题列表

### 1. 清新蓝紫 (blue-purple) - 默认主题
- **色调**: 蓝紫色系
- **风格**: 清新优雅
- **适用场景**: 日常办公、长时间使用
- **主色**: `#667eea`

### 2. 森林绿 (forest-green)
- **色调**: 绿色系
- **风格**: 自然清新
- **适用场景**: 专注工作、护眼需求
- **主色**: `#059669`

### 3. 暖橙红 (warm-orange)
- **色调**: 橙红色系
- **风格**: 温暖活力
- **适用场景**: 创意工作、激发灵感
- **主色**: `#ea580c`

### 4. 深海蓝 (deep-blue)
- **色调**: 深蓝色系
- **风格**: 沉稳专业
- **适用场景**: 商务场合、正式环境
- **主色**: `#1e40af`

### 5. 薰衣草紫 (lavender-purple)
- **色调**: 紫色系
- **风格**: 优雅浪漫
- **适用场景**: 个人使用、美化界面
- **主色**: `#7c3aed`

### 6. 暗黑模式 (dark)
- **色调**: 深色系
- **风格**: 护眼舒适
- **适用场景**: 低光环境、夜间使用
- **主色**: `#818cf8`

## 使用方法

### 1. 在设置页面切换主题

1. 点击侧边栏的"设置"菜单
2. 在"主题外观"部分选择您喜欢的主题
3. 点击主题卡片即可立即切换

### 2. 使用主题切换按钮

应用侧边栏底部提供了快速的主题切换按钮，可以在亮色和暗色主题之间快速切换。

### 3. 编程方式使用

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, setTheme, toggleTheme, themes } = useTheme();
  
  // 获取当前主题
  console.log('当前主题:', theme);
  
  // 切换到特定主题
  const switchToForestGreen = () => {
    setTheme('forest-green');
  };
  
  // 在亮色/暗色之间切换
  const handleToggle = () => {
    toggleTheme();
  };
  
  return (
    <div>
      <button onClick={switchToForestGreen}>
        切换到森林绿主题
      </button>
      <button onClick={handleToggle}>
        切换亮色/暗色
      </button>
    </div>
  );
}
```

### 4. 使用ThemeToggle组件

```tsx
import ThemeToggle from '@/components/ThemeToggle';

function Header() {
  return (
    <div className="header">
      {/* 不同尺寸 */}
      <ThemeToggle size="sm" />
      <ThemeToggle size="md" />
      <ThemeToggle size="lg" />
      
      {/* 显示标签 */}
      <ThemeToggle showLabel />
      
      {/* 自定义样式 */}
      <ThemeToggle className="my-theme-toggle" />
    </div>
  );
}
```

## 技术实现

### CSS 变量系统

主题系统基于 CSS 变量实现，每个主题都会重新定义相同的变量名，确保组件样式的一致性：

```css
:root {
  --color-primary: #667eea;
  --color-background: #fafbfc;
  --color-text-primary: #1e293b;
  /* ... 更多变量 */
}

[data-theme='dark'] {
  --color-primary: #818cf8;
  --color-background: #0f172a;
  --color-text-primary: #f1f5f9;
  /* ... 重新定义变量 */
}
```

### 主题切换流程

1. **状态管理**: 使用 React Context + Hook 管理主题状态
2. **DOM 操作**: 通过修改 `document.documentElement` 的 `data-theme` 属性
3. **持久化**: 自动保存到 localStorage
4. **系统跟随**: 支持跟随系统主题设置

### 动画效果

主题切换包含平滑的过渡动画：

```css
* {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: var(--transition-normal);
  transition-timing-function: ease-in-out;
}
```

## 自定义主题

如需添加新的主题，请按照以下步骤：

### 1. 扩展主题类型

```typescript
// src/renderer/hooks/useTheme.ts
export type ThemeType = 
  | 'blue-purple'
  | 'forest-green'
  | 'warm-orange'
  | 'deep-blue'
  | 'lavender-purple'
  | 'dark'
  | 'your-new-theme'; // 添加新主题
```

### 2. 添加主题配置

```typescript
export const THEMES = {
  // ... 现有主题
  'your-new-theme': {
    name: '您的主题名称',
    description: '主题描述',
    primaryColor: '#your-color',
    isLight: true,
  },
};
```

### 3. 定义CSS变量

```less
// src/renderer/design-system/styles/tokens.less
[data-theme='your-new-theme'] {
  --color-primary: #your-primary-color;
  --color-background: #your-background-color;
  // ... 定义所有必要的颜色变量
}
```

## 最佳实践

### 1. 使用语义化变量名

```css
/* 推荐 */
color: var(--color-text-primary);
background: var(--color-surface);

/* 不推荐 */
color: #1e293b;
background: #ffffff;
```

### 2. 考虑可访问性

- 确保文本和背景有足够的对比度
- 在暗色主题中调整阴影和边框
- 支持 `prefers-color-scheme` 媒体查询

### 3. 测试所有主题

在开发新功能时，请在所有主题下测试界面效果，确保：
- 颜色搭配协调
- 文本可读
- 交互状态清晰

## 故障排除

### 主题切换后颜色不变

检查是否使用了硬编码的颜色值，应该使用 CSS 变量：

```css
/* 错误 */
.my-component {
  color: #667eea;
}

/* 正确 */
.my-component {
  color: var(--color-primary);
}
```

### 主题状态不持久

确保 ThemeProvider 正确包装了应用根组件，并且浏览器支持 localStorage。

### 动画效果过于强烈

用户可能启用了"减少动画"偏好，系统会自动适配：

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 更新日志

- **v1.0.0**: 初始版本，支持 6 种主题
- 添加主题切换动画
- 集成系统主题跟随
- 提供完整的开发工具和文档 
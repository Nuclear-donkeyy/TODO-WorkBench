# TODO WorkBench 设计系统

## 概述

这是一个基于React和TypeScript构建的现代化设计系统，专为TODO WorkBench应用程序设计。设计系统提供了一套完整的UI组件、设计令牌和布局系统，确保应用程序的一致性和可维护性。

## 特性

- 🎨 **统一的设计语言** - 基于设计令牌的一致性色彩和间距系统
- 🔧 **高度可复用** - 模块化组件设计，支持多种变体和配置
- 📱 **响应式设计** - 内置移动端适配和响应式布局
- ♿ **无障碍访问** - 符合WCAG 2.1标准的无障碍设计
- 🌙 **主题支持** - 内置明暗主题切换功能
- 📦 **TypeScript支持** - 完整的类型定义和类型安全

## 目录结构

```
design-system/
├── components/          # UI组件
│   ├── Button/         # 按钮组件
│   ├── Card/           # 卡片组件
│   ├── Layout/         # 布局组件
│   └── index.ts        # 组件导出
├── tokens/             # 设计令牌
│   ├── colors.ts       # 色彩系统
│   ├── spacing.ts      # 间距系统
│   └── typography.ts   # 字体系统
├── styles/             # 样式文件
│   ├── tokens.less     # CSS变量定义
│   └── index.less      # 样式入口
├── hooks/              # 共享Hooks
│   └── useTheme.ts     # 主题管理
└── README.md           # 文档说明
```

## 设计令牌

### 色彩系统

基于蓝紫色调的现代化配色方案：

- **主色**: `#667eea` - 清新蓝紫色
- **次色**: `#764ba2` - 优雅紫色
- **强调色**: `#00d4aa` - 薄荷绿
- **中性色**: 灰度色板从50-900
- **语义色**: 成功、警告、错误、信息

### 间距系统

基于8px网格的间距系统：

- 基础单位: 4px, 8px, 12px, 16px, 24px, 32px...
- 语义化命名: xs, sm, md, lg, xl

### 字体系统

- **字体族**: 系统字体栈，优先使用San Francisco、Segoe UI等
- **字体大小**: 从12px到60px的递进式字体大小
- **字体粗细**: 从light到black的完整粗细系列

## 组件库

### Button 按钮

支持多种变体和状态的按钮组件：

```tsx
import { Button } from '../design-system/components';

// 基础用法
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">边框按钮</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>

// 带图标
<Button icon={<Icon />} iconPosition="left">带图标</Button>

// 加载状态
<Button loading>加载中...</Button>
```

### Card 卡片

灵活的卡片容器组件：

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '../design-system/components';

<Card variant="elevated" hoverable>
  <CardHeader>
    <h3>卡片标题</h3>
  </CardHeader>
  <CardBody>
    <p>卡片内容</p>
  </CardBody>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>
```

### Layout 布局

完整的布局系统：

```tsx
import { Layout, Sidebar, Content, Header, Footer } from '../design-system/components';

<Layout direction="horizontal">
  <Sidebar width={280} position="left">
    侧边栏内容
  </Sidebar>
  <Content padding="lg">
    主要内容区域
  </Content>
</Layout>
```

## 主题系统

使用`useTheme` Hook管理应用主题：

```tsx
import { useTheme } from '../design-system/hooks/useTheme';

function ThemeToggle() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      当前主题: {actualTheme}
    </Button>
  );
}
```

## 使用指南

### 1. 安装设计系统

在项目入口文件中引入设计系统样式：

```tsx
// src/renderer/index.tsx
import './design-system/styles/index.less';
```

### 2. 使用组件

```tsx
import { Button, Card, Layout } from './design-system/components';

function MyComponent() {
  return (
    <Card variant="elevated">
      <Button variant="primary" size="lg">
        立即开始
      </Button>
    </Card>
  );
}
```

### 3. 使用设计令牌

在CSS中使用设计令牌：

```less
.my-component {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
}
```

在TypeScript中使用：

```tsx
import { ColorTokens, SpacingTokens } from './design-system/components';

const styles = {
  color: ColorTokens.primary[500],
  padding: SpacingTokens[4],
};
```

## 最佳实践

### 组件设计原则

1. **一致性** - 使用统一的设计令牌和命名规范
2. **可复用性** - 通过props支持多种配置和变体
3. **可访问性** - 遵循ARIA标准和键盘导航支持
4. **性能优化** - 使用React.forwardRef和合理的渲染优化

### 样式组织

1. **CSS变量** - 优先使用CSS变量实现主题切换
2. **BEM命名** - 组件样式使用BEM命名规范
3. **响应式设计** - 使用媒体查询实现移动端适配
4. **渐进增强** - 确保基础功能在所有环境下可用

### 扩展指南

当需要添加新组件时：

1. 在`components/`目录下创建新组件文件夹
2. 实现组件逻辑（.tsx）和样式（.less）
3. 使用设计令牌确保一致性
4. 添加TypeScript类型定义
5. 在`index.ts`中导出组件

## 贡献指南

1. 遵循现有的代码风格和命名规范
2. 确保新组件支持所有变体和状态
3. 添加完整的TypeScript类型定义
4. 测试组件在不同主题下的表现
5. 更新相关文档

## 版本记录

- **v1.0.0** - 初始版本，包含基础组件和设计令牌系统 
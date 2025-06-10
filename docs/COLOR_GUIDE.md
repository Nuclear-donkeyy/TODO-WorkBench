# 🎨 清新色彩系统使用指南

## 🎯 色彩理念
整体色彩系统以"清新、优雅、现代"为设计理念，采用蓝紫色调作为主色，薄荷绿作为选中色，营造清新舒适的视觉体验。

## 🌈 色彩分类

### 1. 主题色系 (Primary Colors)
**用途：** 品牌色、主要按钮、重要元素
- `@primary-color-light: #667eea` - 主要品牌色
- `@primary-color-dark: #5a6fd8` - 深色变体（hover状态）
- `@primary-color-lighter: #8b9df0` - 浅色变体（禁用状态）
- `@primary-color-soft: #e8ecff` - 极浅变体（背景色）

### 2. 次主题色系 (Secondary Colors)
**用途：** 辅助元素、装饰、渐变
- `@secondary-color-light: #764ba2` - 次要品牌色
- `@secondary-color-dark: #6a4190` - 深色变体
- `@secondary-color-lighter: #9d7bc4` - 浅色变体
- `@secondary-color-soft: #f0ebf7` - 极浅变体

### 3. 选中色系 (Accent Colors) - 清新薄荷绿
**用途：** 选中状态、强调、成功操作
- `@accent-color: #00d4aa` - 选中主色
- `@accent-color-dark: #00c499` - 深色变体（active状态）
- `@accent-color-light: #33dcbb` - 浅色变体
- `@accent-color-soft: #e6faf7` - 极浅变体（背景）

### 4. 区域色系 (Surface Colors)
**用途：** 卡片、面板、容器背景
- `@surface-color-primary: #ffffff` - 主要表面色（白色）
- `@surface-color-secondary: #f8fafc` - 次要表面色
- `@surface-color-tertiary: #f1f5f9` - 三级表面色
- `@surface-color-quaternary: #e2e8f0` - 四级表面色

### 5. 背景色系 (Background Colors)
**用途：** 页面背景、遮罩层
- `@background-color-light: #fafbfc` - 主背景色
- `@background-color-dark: #1a1d23` - 暗色背景
- `@background-color-overlay: rgba(255, 255, 255, 0.95)` - 遮罩层
- `@background-color-modal: rgba(0, 0, 0, 0.5)` - 模态框背景

### 6. 文本色系 (Text Colors)
**用途：** 各级文字内容
- `@text-color-primary: #1e293b` - 主要文字
- `@text-color-secondary: #475569` - 次要文字
- `@text-color-tertiary: #64748b` - 三级文字
- `@text-color-placeholder: #94a3b8` - 占位符文字
- `@text-color-disabled: #cbd5e1` - 禁用文字
- `@text-color-inverse: #ffffff` - 反转文字（深色背景用）

### 7. 边框色系 (Border Colors)
**用途：** 组件边框、分割线
- `@border-color-light: #e2e8f0` - 浅色边框
- `@border-color-medium: #cbd5e1` - 中等边框
- `@border-color-strong: #94a3b8` - 强调边框
- `@border-color-accent: @accent-color` - 选中边框

### 8. 状态色系 (Status Colors)
**用途：** 反馈状态、消息提示
- **成功色：** `#10b981`, `#34d399`, `#d1fae5`
- **危险色：** `#ef4444`, `#f87171`, `#fecaca`
- **警告色：** `#f59e0b`, `#fbbf24`, `#fef3c7`
- **信息色：** `#3b82f6`, `#60a5fa`, `#dbeafe`

## 🎯 使用建议

### ✅ 推荐搭配
```css
/* 主要按钮 */
background: var(--primary-color);
color: var(--text-inverse);

/* 选中状态 */
background: var(--accent-color-soft);
border: 1px solid var(--accent-color);

/* 卡片容器 */
background: var(--surface-primary);
border: 1px solid var(--border-light);

/* 文字层次 */
color: var(--text-primary);    /* 标题 */
color: var(--text-secondary);  /* 正文 */
color: var(--text-tertiary);   /* 说明 */
```

### 🎨 视觉层次
1. **最强调：** 薄荷绿选中色
2. **强调：** 主题蓝紫色
3. **中等：** 次主题紫色
4. **轻微：** 中性灰色系

### 💡 配色原则
- **对比度：** 确保文字与背景有足够对比度
- **层次感：** 使用不同深浅营造视觉层次
- **和谐性：** 相邻色彩过渡自然
- **功能性：** 不同颜色传达不同含义

## 🚀 实际应用示例

```css
/* MenuItem组件优化建议 */
.item-container {
  background: var(--surface-primary);
  border: 1px solid var(--border-light);
  
  &:hover {
    background: var(--accent-color-soft);
    border-color: var(--accent-color);
  }
  
  &.active {
    background: var(--accent-color);
    color: var(--text-inverse);
  }
}
``` 
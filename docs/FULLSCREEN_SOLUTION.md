# Electron 应用全屏显示解决方案

## 问题描述
在 Electron 应用中，即使设置了 `width: 100%` 和 `height: 100%`，有时候应用仍然无法完全占满整个窗口，特别是在全屏模式下。

## 根本原因
1. **HTML 和 Body 元素缺少高度设置**：只设置了 `#root` 的高度，但没有设置 `html` 和 `body` 的高度
2. **缺少 box-sizing 设置**：没有统一的盒模型设置
3. **窗口大小变化时缺少响应机制**：应用无法动态适应窗口大小变化

## 完整解决方案

### 1. 修复基础样式 (index.html)

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

**关键点：**
- 同时设置 `html` 和 `body` 的高度为 `100%`
- 添加 `overflow: hidden` 防止滚动条
- 为 `#root` 添加 `display: flex` 确保布局正确

### 2. 优化全局样式 (variables.less)

```less
*, *::before, *::after {
  box-sizing: border-box;
}
```

**作用：** 统一盒模型，确保 padding 和 border 不会影响元素尺寸

### 3. 优化容器样式 (App/index.less)

```less
.app-container {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-color: #d8dee2;
  margin: 0;
  padding: 0;
  display: flex;
  overflow: hidden;

  .leftSide-bar {
    width: 20%;
    height: 100%;
    // ... 其他样式
    overflow-y: auto;
  }

  .content-container {
    width: 80%;
    height: 100%;
    // ... 其他样式
    overflow: hidden;
  }
}
```

**关键点：**
- 使用 `100vh` 确保占满视口高度
- 为子容器设置明确的高度
- 合理设置 overflow 属性

### 4. 优化 Electron 窗口配置 (main.ts)

```typescript
mainWindow = new BrowserWindow({
  // ... 其他配置
  minWidth: 800,
  minHeight: 600,
  fullscreenable: true,
  maximizable: true,
  resizable: true,
  webPreferences: {
    // ... 其他配置
    enablePreferredSizeMode: true,
  },
});

// 监听窗口大小变化
mainWindow.on('resize', () => {
  if (mainWindow) {
    mainWindow.webContents.send('window-resize', mainWindow.getSize());
  }
});

// 监听全屏状态变化
mainWindow.on('enter-full-screen', () => {
  if (mainWindow) {
    mainWindow.webContents.send('enter-full-screen');
  }
});
```

### 5. 创建窗口大小监听 Hook (useWindowSize.ts)

```typescript
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // 监听 Electron 窗口事件
    if (window.electron) {
      window.electron.on('window-resize', (size: [number, number]) => {
        setWindowSize({ width: size[0], height: size[1] });
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};
```

### 6. 在 App 组件中使用响应式布局

```typescript
export default function App(): JSX.Element {
  const windowSize = useWindowSize();

  useEffect(() => {
    // 强制更新布局
    const root = document.getElementById('root');
    if (root) {
      root.style.width = '100%';
      root.style.height = '100vh';
    }
    
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
  }, [windowSize]);

  return (
    <div 
      className='app-container'
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      {/* 组件内容 */}
    </div>
  );
}
```

## 核心原理

### CSS 高度继承链
```
html (100%) → body (100%) → #root (100%) → .app-container (100vh)
```

每一层都必须正确设置高度，才能确保最终元素占满整个窗口。

### 视口单位的使用
- `100vh`：视口高度的 100%，更可靠
- `100%`：相对于父元素的高度，需要父元素有明确高度

### Flexbox 布局
使用 Flexbox 可以更好地控制子元素的高度分配，避免高度计算问题。

## 测试方法

1. **正常窗口模式**：调整窗口大小，观察应用是否完全占满窗口
2. **最大化模式**：点击最大化按钮，检查是否占满整个屏幕
3. **全屏模式**：按 F11 进入全屏，确认无边距和滚动条
4. **动态调整**：手动拖拽窗口边界，观察内容是否实时适应

## 常见问题

### Q: 为什么不能只设置 body 的高度？
A: 如果 html 元素没有设置高度，body 的 100% 高度将基于内容高度而不是窗口高度。

### Q: overflow: hidden 会不会影响内容滚动？
A: 只在最外层容器设置 overflow: hidden，内部组件可以根据需要设置自己的滚动。

### Q: 使用 100vh 和 100% 有什么区别？
A: 100vh 是绝对单位，直接基于视口高度；100% 是相对单位，需要父元素有明确高度。

## 总结

通过以上完整的解决方案，可以确保 Electron 应用在任何窗口模式下都能完美占满整个窗口，并且能够响应窗口大小的动态变化。关键是建立完整的高度继承链，使用合适的 CSS 单位，并配合 JavaScript 监听窗口变化事件。 
# 📝 TODO WorkBench

> 一个基于 Electron + React + TypeScript + Less 构建的现代化任务管理应用

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![Electron](https://img.shields.io/badge/electron-36.4.0-blue)
![React](https://img.shields.io/badge/react-18.3.1-blue)

## ✨ 特性

- 🚀 **现代化技术栈**: Electron + React + TypeScript + Redux Toolkit
- 🎨 **优雅的UI设计**: 基于Less预处理器的模块化样式系统
- 🔥 **热重载开发**: 支持React组件、TypeScript和Less文件的实时更新
- 📱 **响应式设计**: 适配不同屏幕尺寸的用户界面
- 🗄️ **数据持久化**: SQLite3本地数据库存储
- 🌐 **全栈架构**: 内置Express后端服务
- 🛠️ **完整工具链**: ESLint代码检查、TypeScript类型检查

## 🏗️ 技术栈

### 前端技术
- **框架**: React 18.3.1
- **语言**: TypeScript 5.3.0
- **状态管理**: Redux Toolkit 2.8.2
- **路由**: React Router DOM 6.30.1
- **样式**: Less 4.2.0 + CSS Modules
- **桌面应用**: Electron 36.4.0

### 后端技术
- **运行时**: Node.js
- **框架**: Express 4.18.2
- **数据库**: SQLite3 5.1.6
- **中间件**: CORS、Body-parser

### 开发工具
- **构建工具**: Webpack 5 + TypeScript
- **热重载**: Webpack Dev Server + React Fast Refresh
- **代码检查**: ESLint + TypeScript ESLint
- **样式处理**: Less Loader + CSS Loader
- **进程管理**: Concurrently + Wait-on

## 📦 安装

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 克隆项目
```bash
git clone https://github.com/Nuclear-donkeyy/TODO-WorkBench.git
cd TODO-WorkBench
```

### 安装依赖
```bash
npm install
```

## 🚀 快速开始

### 开发环境（推荐）
启动热重载开发环境，支持代码实时更新：
```bash
npm run dev:hot
```

### 生产环境
构建并启动生产版本：
```bash
npm run start:build
```

### 仅启动应用
如果已有构建文件，直接启动应用：
```bash
npm start
```

## 🛠️ 开发指南

### 项目结构
```
TODO-WorkBench/
├── src/                          # 源代码目录
│   ├── main.ts                   # Electron主进程
│   │   ├── renderer/                 # 渲染进程（React应用）
│   │   │   ├── components/           # React组件
│   │   │   ├── store/                # Redux状态管理
│   │   │   ├── variables.less        # Less全局变量
│   │   │   ├── mixins.less           # Less混合样式
│   │   │   ├── App.tsx               # 根组件
│   │   │   ├── App.less              # 应用样式
│   │   │   └── index.tsx             # 应用入口
│   │   ├── backend/                  # 后端服务
│   │   │   ├── server.ts             # Express服务器
│   │   │   └── database.ts           # 数据库操作
│   │   └── types/                    # TypeScript类型定义
│   ├── dist/                         # 构建输出目录
│   ├── webpack.config.js             # 生产环境Webpack配置
│   ├── webpack.dev.config.js         # 开发环境Webpack配置
│   ├── dev-start.js                  # 开发环境启动脚本
│   ├── tsconfig.json                 # TypeScript配置
│   ├── .eslintrc.json               # ESLint配置
│   └── package.json                  # 项目配置
```

### 开发工作流

#### 1. 前端开发（热重载）
```bash
# 启动完整热重载环境
npm run dev:hot

# 单独启动webpack开发服务器
npm run build:renderer:dev

# 单独启动Electron开发模式
npm run start:dev
```

#### 2. 后端开发
```bash
# 启动后端开发服务器（支持自动重启）
npm run dev-server

# 仅启动后端服务
npm run server
```

#### 3. 全栈开发
```bash
# 启动完整全栈应用
npm run fullstack
```

### 构建命令详解

| 命令 | 功能 | 用途 |
|------|------|------|
| `npm run build` | 完整构建 | 生产环境构建 |
| `npm run build:main` | 构建主进程 | Electron主进程编译 |
| `npm run build:renderer` | 构建渲染进程 | React应用构建 |
| `npm run build:watch` | 监听构建 | 文件变更自动构建 |
| `npm run clean` | 清理构建 | 删除dist目录 |

### 代码检查和类型检查
```bash
# 运行ESLint检查
npm run lint

# 运行TypeScript类型检查
npm run type-check
```

## 🎨 样式系统

项目使用Less预处理器构建了完整的样式系统：

### 变量系统 (`variables.less`)
- 颜色体系：主色调、辅助色、灰度色
- 字体系统：字体族、大小、权重
- 间距系统：统一的边距和内边距
- 其他：边框圆角、阴影、动画时长

### 混合样式 (`mixins.less`)
- 按钮组件：主要、次要、危险按钮
- 输入框组件：统一的表单样式
- 布局组件：Flex布局组合
- 工具函数：过渡动画、卡片样式

### 使用示例
```less
// 使用变量
.my-component {
  color: @primary-color;
  padding: @spacing-lg;
  border-radius: @border-radius-md;
}

// 使用混合样式
.my-button {
  .button-primary();
}
```

## 🔧 配置说明

### 热重载配置
项目配置了完整的热重载开发环境：

- **React组件**: 组件状态保持的热重载
- **TypeScript**: 自动重新编译
- **Less样式**: 实时样式更新
- **错误覆盖**: 编译错误页面显示

### Electron配置
- **开发模式**: 自动连接到webpack开发服务器
- **生产模式**: 加载本地构建文件
- **开发工具**: 开发模式自动开启DevTools

### 数据库配置
- **类型**: SQLite3本地数据库
- **位置**: 项目根目录`database.sqlite`
- **初始化**: 应用启动时自动创建表结构


## 🚨 常见问题

### 端口占用
如果3000端口被占用，可以修改：
- `webpack.dev.config.js` 中的 `devServer.port`
- `src/main.ts` 中的开发服务器URL

### 热重载不工作
1. 确认webpack开发服务器正常启动
2. 检查浏览器控制台WebSocket连接
3. 尝试硬刷新（Ctrl+F5）

### 主进程修改
修改主进程文件后需要：
1. 停止开发环境（Ctrl+C）
2. 重新运行 `npm run build:main`
3. 重新启动 `npm run dev:hot`

### 数据库问题
如果数据库连接失败：
1. 检查SQLite3安装
2. 确认数据库文件权限
3. 查看后端服务日志

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint代码规范
- 使用Less编写样式，复用变量和混合样式
- 组件命名使用PascalCase
- 文件名使用camelCase

## 📄 许可证

本项目使用 [ISC](https://opensource.org/licenses/ISC) 许可证。

## 👨‍💻 作者

**hajimi** - [GitHub](https://github.com/Nuclear-donkeyy)

## 🔗 相关链接

- [项目仓库](https://github.com/Nuclear-donkeyy/TODO-WorkBench)
- [问题反馈](https://github.com/Nuclear-donkeyy/TODO-WorkBench/issues)
- [Electron官方文档](https://www.electronjs.org/)
- [React官方文档](https://react.dev/)
- [Less官方文档](https://lesscss.org/)

---

⭐ 如果这个项目对您有帮助，请给个Star支持一下！ 
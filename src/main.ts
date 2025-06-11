import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { IElectronConfig } from './types';
import { ChildProcess, spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null; //后端进程

// Electron配置
const electronConfig: IElectronConfig = {
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
  },
  show: false,
  titleBarStyle: 'default',
};

function createWindow(): void {
  mainWindow = new BrowserWindow({
    ...electronConfig,
    icon: path.join(__dirname, 'assets/icon.png'),
    autoHideMenuBar: true, // 隐藏菜单栏
    minWidth: 800, // 最小宽度
    minHeight: 600, // 最小高度
    fullscreenable: true, // 允许全屏
    maximizable: true, // 允许最大化
    resizable: true, // 允许调整大小
    webPreferences: {
      ...electronConfig.webPreferences,
      enablePreferredSizeMode: true, // 启用首选大小模式
    },
  });

  // 检查是否是开发模式
  const isDev =
    process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

  if (isDev) {
    // 开发模式下加载开发服务器
    mainWindow.loadURL('http://localhost:3000');
    console.log('[main] 开发模式：加载 http://localhost:3000');
  } else {
    // 生产模式下加载本地文件
    mainWindow.loadFile(path.join(__dirname, './index.html'));
    console.log(
      '[main] 生产模式：加载文件 ' + path.join(__dirname, './index.html')
    );
  }

  mainWindow.once('ready-to-show', (): void => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // 监听窗口大小变化，确保内容适应
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

  mainWindow.on('leave-full-screen', () => {
    if (mainWindow) {
      mainWindow.webContents.send('leave-full-screen');
    }
  });

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });
}

app.whenReady().then((): void => {
  console.log('[main] electron 应用启动');
  // 启动后端子进程
  backendProcess = spawn('node', ['dist/backend/server.js'], {
    stdio: 'pipe',
  });
  backendProcess.stdout?.on('data', data => {
    console.log(`[Backend] ${data}`);
  });

  // 等待后端启动后创建窗口
  setTimeout(() => {
    createWindow();
  }, 2000);
});

app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', (error: Error): void => {
  console.error('[main] Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>): void => {
  console.error('[main]Unhandled Rejection at:', promise, 'reason:', reason);
});

app.on('before-quit', (): void => {
  console.log('应用准备退出...');

  if (backendProcess) {
    // 首先尝试礼貌地终止
    backendProcess.kill('SIGTERM');

    // 如果 3 秒后进程仍未退出，强制终止
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        console.log('[main]强制终止后端进程...');
        backendProcess.kill('SIGKILL');
      }
    }, 3000);
  }
});

export { mainWindow, createWindow };

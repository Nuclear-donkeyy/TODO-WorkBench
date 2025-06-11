import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { IElectronConfig } from './types';

let mainWindow: BrowserWindow | null = null;

// Electron配置
const electronConfig: IElectronConfig = {
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  autoHideMenuBar: true,
  fullscreenable: true,
  maximizable: true,
  resizable: true,
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
    webPreferences: {
      ...electronConfig.webPreferences,
      enablePreferredSizeMode: true, // 根据内容确定窗口大小
    },
  });

  const isDev =
    process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    console.log('[main] 开发模式：加载 http://localhost:3000');
  } else {
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

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });
}

app.whenReady().then((): void => {
  createWindow();
});

app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
export { mainWindow, createWindow };

import { app, BrowserWindow, ipcMain } from 'electron';
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
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
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
      preload: path.join(__dirname, 'preload.js'),
      enablePreferredSizeMode: true,
    },
  });

  const isDev =
    process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, './index.html'));
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

  ipcMain.on('test', (_event, msg) => console.log(msg));
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

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { IElectronConfig } from './types';
import { ChildProcess, spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;//后端进程

// Electron配置
const electronConfig: IElectronConfig = {
    width: 1200,
    height: 800,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
    },
    show: false,
    titleBarStyle: 'default'
};

function createWindow(): void {
    mainWindow = new BrowserWindow({
        ...electronConfig,
        icon: path.join(__dirname, 'assets/icon.png'),
        autoHideMenuBar: true, // 隐藏菜单栏
        webPreferences: {
            ...electronConfig.webPreferences
        }
    });

    // 检查是否是开发模式
    const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
    
    if (isDev) {
        // 开发模式下加载开发服务器
        mainWindow.loadURL('http://localhost:3000');
        console.log("开发模式：加载 http://localhost:3000");
    } else {
        // 生产模式下加载本地文件
        mainWindow.loadFile(path.join(__dirname, './index.html'));
        console.log("生产模式：加载文件 " + path.join(__dirname, './index.html'));
    }
    mainWindow.once('ready-to-show', (): void => {
        if (mainWindow) {
            mainWindow.show();
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
    console.log("electron 应用启动");
    // 启动后端子进程
    backendProcess = spawn('node', ['dist/backend/server.js'], {
        stdio: 'pipe'
    });
    backendProcess.stdout?.on('data', (data) => {
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
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>): void => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.on('before-quit', (): void => {
    console.log('应用准备退出...');
    
    if (backendProcess) {
        // 首先尝试礼貌地终止
        backendProcess.kill('SIGTERM');
        
        // 如果 3 秒后进程仍未退出，强制终止
        setTimeout(() => {
            if (backendProcess && !backendProcess.killed) {
                console.log('强制终止后端进程...');
                backendProcess.kill('SIGKILL');
            }
        }, 3000);
    }
});

export { mainWindow, createWindow }; 
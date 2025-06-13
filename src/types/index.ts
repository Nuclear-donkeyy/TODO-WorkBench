// 主进程配置接口
export interface IElectronConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  autoHideMenuBar: boolean;
  fullscreenable: boolean;
  maximizable: boolean;
  resizable: boolean;
  webPreferences: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    enableRemoteModule: boolean;
  };
  icon?: string;
  show: boolean;
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
}

// 常量类型
export const TODO_FILTERS = ['all', 'active', 'completed'] as const;
export const MESSAGE_TYPES = ['success', 'error', 'info', 'warning'] as const;
export const TODO_EVENTS = [
  'todo:created',
  'todo:updated',
  'todo:deleted',
  'todo:completed',
  'todos:cleared',
  'connection:changed',
] as const;

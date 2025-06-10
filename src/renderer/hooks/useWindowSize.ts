import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

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

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 监听Electron的窗口事件（如果在Electron环境中）
    let ipcRenderer: any = null;
    try {
      // 检查是否在Electron环境中
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer: electronIpcRenderer } = window.require('electron');
        ipcRenderer = electronIpcRenderer;

        ipcRenderer.on(
          'window-resize',
          (_event: any, size: [number, number]) => {
            setWindowSize({
              width: size[0],
              height: size[1],
            });
          }
        );

        ipcRenderer.on('enter-full-screen', () => {
          // 全屏时更新尺寸
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        });

        ipcRenderer.on('leave-full-screen', () => {
          // 退出全屏时更新尺寸
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        });
      }
    } catch (error) {
      // 在非Electron环境中忽略错误
      console.log('Not running in Electron environment');
    }

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);

      // 清理Electron事件监听器
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('window-resize');
        ipcRenderer.removeAllListeners('enter-full-screen');
        ipcRenderer.removeAllListeners('leave-full-screen');
      }
    };
  }, []);

  return windowSize;
};

export default useWindowSize;

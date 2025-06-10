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
    if (window.electron) {
      window.electron.on('window-resize', (size: [number, number]) => {
        setWindowSize({
          width: size[0],
          height: size[1],
        });
      });

      window.electron.on('enter-full-screen', () => {
        // 全屏时更新尺寸
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });

      window.electron.on('leave-full-screen', () => {
        // 退出全屏时更新尺寸
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });
    }

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;

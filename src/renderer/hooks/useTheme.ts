import { createContext, useContext, useEffect, useState } from 'react';

// 定义主题类型
export type ThemeType =
  | 'blue-purple'
  | 'forest-green'
  | 'warm-orange'
  | 'deep-blue'
  | 'lavender-purple'
  | 'dark';

// 主题配置
export const THEMES = {
  'blue-purple': {
    name: '清新蓝紫',
    description: '默认主题，清新优雅的蓝紫色调',
    primaryColor: '#667eea',
    isLight: true,
  },
  'forest-green': {
    name: '森林绿',
    description: '自然清新的森林绿色调',
    primaryColor: '#059669',
    isLight: true,
  },
  'warm-orange': {
    name: '暖橙红',
    description: '温暖活力的橙红色调',
    primaryColor: '#ea580c',
    isLight: true,
  },
  'deep-blue': {
    name: '深海蓝',
    description: '沉稳专业的深海蓝色调',
    primaryColor: '#1e40af',
    isLight: true,
  },
  'lavender-purple': {
    name: '薰衣草紫',
    description: '优雅浪漫的薰衣草紫色调',
    primaryColor: '#7c3aed',
    isLight: true,
  },
  dark: {
    name: '暗黑模式',
    description: '护眼舒适的暗黑主题',
    primaryColor: '#818cf8',
    isLight: false,
  },
} as const;

// 主题上下文类型
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  themes: typeof THEMES;
}

// 创建主题上下文
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// 主题存储键
const THEME_STORAGE_KEY = 'app-theme';

// 获取系统默认主题
const getSystemTheme = (): ThemeType => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'blue-purple';
  }
  return 'blue-purple';
};

// 获取存储的主题
const getStoredTheme = (): ThemeType => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
    if (stored && Object.keys(THEMES).includes(stored)) {
      return stored;
    }
  }
  return getSystemTheme();
};

// 应用主题到DOM
const applyTheme = (theme: ThemeType) => {
  if (typeof document !== 'undefined') {
    // 移除所有主题类
    document.documentElement.removeAttribute('data-theme');

    // 设置新主题
    if (theme !== 'blue-purple') {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // 更新meta主题色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEMES[theme].primaryColor);
    }
  }
};

// 保存主题到存储
const saveTheme = (theme: ThemeType) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

// useTheme Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 创建主题 Hook（用于 ThemeProvider 内部）
export const useThemeState = () => {
  const [theme, setThemeState] = useState<ThemeType>(() => getStoredTheme());

  // 设置主题
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  };

  // 切换主题（在亮色和暗色之间）
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'blue-purple' : 'dark';
    setTheme(newTheme);
  };

  // 初始化应用主题
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        // 只有当前没有手动设置主题时才跟随系统
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (!stored) {
          const systemTheme = e.matches ? 'dark' : 'blue-purple';
          setTheme(systemTheme);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    themes: THEMES,
  };
};

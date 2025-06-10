// 设计令牌 - 色彩系统
export const ColorTokens = {
  // 基础色板
  primary: {
    50: '#f0f4ff',
    100: '#e0ebff',
    200: '#bbd6ff',
    300: '#84b5ff',
    400: '#4a8fff',
    500: '#667eea', // 主色
    600: '#5a6fd8',
    700: '#4f5bb8',
    800: '#434a99',
    900: '#3a417a',
  },

  secondary: {
    50: '#f7f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#764ba2', // 次主色
    600: '#6a4190',
    700: '#5b357e',
    800: '#4c2a6c',
    900: '#3d1f5a',
  },

  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#00d4aa', // 强调色
    600: '#00c499',
    700: '#00a082',
    800: '#00876b',
    900: '#006d54',
  },

  neutral: {
    50: '#fafbfc',
    100: '#f8fafc',
    200: '#f1f5f9',
    300: '#e2e8f0',
    400: '#cbd5e1',
    500: '#94a3b8',
    600: '#64748b',
    700: '#475569',
    800: '#1e293b',
    900: '#0f172a',
  },

  // 语义化色彩
  semantic: {
    success: {
      light: '#d1fae5',
      main: '#10b981',
      dark: '#065f46',
    },
    warning: {
      light: '#fef3c7',
      main: '#f59e0b',
      dark: '#92400e',
    },
    error: {
      light: '#fecaca',
      main: '#ef4444',
      dark: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      main: '#3b82f6',
      dark: '#1e40af',
    },
  },

  // 功能性色彩
  surface: {
    background: '#fafbfc',
    paper: '#ffffff',
    elevated: '#ffffff',
    overlay: 'rgba(255, 255, 255, 0.95)',
    modal: 'rgba(0, 0, 0, 0.5)',
  },

  text: {
    primary: '#1e293b',
    secondary: '#475569',
    tertiary: '#64748b',
    placeholder: '#94a3b8',
    disabled: '#cbd5e1',
    inverse: '#ffffff',
  },

  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    strong: '#94a3b8',
    focus: '#667eea',
  },
} as const;

// 色彩工具函数
export const ColorUtils = {
  // 获取透明度变体
  alpha: (color: string, alpha: number): string => {
    // 简单的透明度处理，实际项目中可能需要更复杂的颜色处理库
    return `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')}`;
  },

  // 获取主题色彩
  getThemeColor: (
    colorKey: keyof typeof ColorTokens,
    shade: number = 500
  ): string => {
    const colorGroup = ColorTokens[colorKey];
    if (typeof colorGroup === 'object' && 'main' in colorGroup) {
      return (colorGroup as any).main;
    }
    return (colorGroup as any)[shade] || (colorGroup as any)[500];
  },
};

// 导出CSS变量映射
export const CSSVariables = {
  '--color-primary': ColorTokens.primary[500],
  '--color-primary-light': ColorTokens.primary[400],
  '--color-primary-dark': ColorTokens.primary[600],
  '--color-secondary': ColorTokens.secondary[500],
  '--color-accent': ColorTokens.accent[500],
  '--color-background': ColorTokens.surface.background,
  '--color-surface': ColorTokens.surface.paper,
  '--color-text-primary': ColorTokens.text.primary,
  '--color-text-secondary': ColorTokens.text.secondary,
  '--color-border': ColorTokens.border.light,
  '--color-success': ColorTokens.semantic.success.main,
  '--color-warning': ColorTokens.semantic.warning.main,
  '--color-error': ColorTokens.semantic.error.main,
  '--color-info': ColorTokens.semantic.info.main,
} as const;

// 设计令牌 - 字体系统
export const TypographyTokens = {
  // 字体族
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },

  // 字体大小 (使用rem单位，基于16px)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // 字体粗细
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // 行高
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // 字母间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// 语义化排版样式
export const TypographyStyles = {
  // 标题样式
  heading: {
    h1: {
      fontSize: TypographyTokens.fontSize['4xl'],
      fontWeight: TypographyTokens.fontWeight.bold,
      lineHeight: TypographyTokens.lineHeight.tight,
      letterSpacing: TypographyTokens.letterSpacing.tight,
    },
    h2: {
      fontSize: TypographyTokens.fontSize['3xl'],
      fontWeight: TypographyTokens.fontWeight.semibold,
      lineHeight: TypographyTokens.lineHeight.tight,
      letterSpacing: TypographyTokens.letterSpacing.tight,
    },
    h3: {
      fontSize: TypographyTokens.fontSize['2xl'],
      fontWeight: TypographyTokens.fontWeight.semibold,
      lineHeight: TypographyTokens.lineHeight.snug,
    },
    h4: {
      fontSize: TypographyTokens.fontSize.xl,
      fontWeight: TypographyTokens.fontWeight.medium,
      lineHeight: TypographyTokens.lineHeight.snug,
    },
    h5: {
      fontSize: TypographyTokens.fontSize.lg,
      fontWeight: TypographyTokens.fontWeight.medium,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
    h6: {
      fontSize: TypographyTokens.fontSize.base,
      fontWeight: TypographyTokens.fontWeight.medium,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
  },

  // 正文样式
  body: {
    large: {
      fontSize: TypographyTokens.fontSize.lg,
      fontWeight: TypographyTokens.fontWeight.normal,
      lineHeight: TypographyTokens.lineHeight.relaxed,
    },
    base: {
      fontSize: TypographyTokens.fontSize.base,
      fontWeight: TypographyTokens.fontWeight.normal,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
    small: {
      fontSize: TypographyTokens.fontSize.sm,
      fontWeight: TypographyTokens.fontWeight.normal,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
  },

  // 标签样式
  label: {
    large: {
      fontSize: TypographyTokens.fontSize.base,
      fontWeight: TypographyTokens.fontWeight.medium,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
    base: {
      fontSize: TypographyTokens.fontSize.sm,
      fontWeight: TypographyTokens.fontWeight.medium,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
    small: {
      fontSize: TypographyTokens.fontSize.xs,
      fontWeight: TypographyTokens.fontWeight.medium,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
  },

  // 说明文字样式
  caption: {
    base: {
      fontSize: TypographyTokens.fontSize.sm,
      fontWeight: TypographyTokens.fontWeight.normal,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
    small: {
      fontSize: TypographyTokens.fontSize.xs,
      fontWeight: TypographyTokens.fontWeight.normal,
      lineHeight: TypographyTokens.lineHeight.normal,
    },
  },

  // 代码样式
  code: {
    inline: {
      fontFamily: TypographyTokens.fontFamily.mono,
      fontSize: TypographyTokens.fontSize.sm,
      fontWeight: TypographyTokens.fontWeight.normal,
    },
    block: {
      fontFamily: TypographyTokens.fontFamily.mono,
      fontSize: TypographyTokens.fontSize.sm,
      fontWeight: TypographyTokens.fontWeight.normal,
      lineHeight: TypographyTokens.lineHeight.relaxed,
    },
  },
} as const;

// CSS变量映射
export const TypographyCSSVariables = {
  // 字体族
  '--font-family-sans': TypographyTokens.fontFamily.sans,
  '--font-family-mono': TypographyTokens.fontFamily.mono,

  // 字体大小
  '--font-size-xs': TypographyTokens.fontSize.xs,
  '--font-size-sm': TypographyTokens.fontSize.sm,
  '--font-size-base': TypographyTokens.fontSize.base,
  '--font-size-lg': TypographyTokens.fontSize.lg,
  '--font-size-xl': TypographyTokens.fontSize.xl,
  '--font-size-2xl': TypographyTokens.fontSize['2xl'],
  '--font-size-3xl': TypographyTokens.fontSize['3xl'],
  '--font-size-4xl': TypographyTokens.fontSize['4xl'],

  // 字体粗细
  '--font-weight-normal': TypographyTokens.fontWeight.normal,
  '--font-weight-medium': TypographyTokens.fontWeight.medium,
  '--font-weight-semibold': TypographyTokens.fontWeight.semibold,
  '--font-weight-bold': TypographyTokens.fontWeight.bold,

  // 行高
  '--line-height-tight': TypographyTokens.lineHeight.tight,
  '--line-height-normal': TypographyTokens.lineHeight.normal,
  '--line-height-relaxed': TypographyTokens.lineHeight.relaxed,
} as const;

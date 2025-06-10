// 设计令牌 - 间距系统
export const SpacingTokens = {
  // 基础间距 (8px 基准)
  0: '0px',
  1: '4px', // 0.5 * 8px
  2: '8px', // 1 * 8px
  3: '12px', // 1.5 * 8px
  4: '16px', // 2 * 8px
  5: '20px', // 2.5 * 8px
  6: '24px', // 3 * 8px
  8: '32px', // 4 * 8px
  10: '40px', // 5 * 8px
  12: '48px', // 6 * 8px
  16: '64px', // 8 * 8px
  20: '80px', // 10 * 8px
  24: '96px', // 12 * 8px
  32: '128px', // 16 * 8px
} as const;

// 语义化间距
export const SemanticSpacing = {
  // 内边距
  padding: {
    xs: SpacingTokens[1], // 4px
    sm: SpacingTokens[2], // 8px
    md: SpacingTokens[4], // 16px
    lg: SpacingTokens[6], // 24px
    xl: SpacingTokens[8], // 32px
  },

  // 外边距
  margin: {
    xs: SpacingTokens[1], // 4px
    sm: SpacingTokens[2], // 8px
    md: SpacingTokens[4], // 16px
    lg: SpacingTokens[6], // 24px
    xl: SpacingTokens[8], // 32px
  },

  // 间隙
  gap: {
    xs: SpacingTokens[1], // 4px
    sm: SpacingTokens[2], // 8px
    md: SpacingTokens[3], // 12px
    lg: SpacingTokens[4], // 16px
    xl: SpacingTokens[5], // 20px
  },

  // 组件间距
  component: {
    tight: SpacingTokens[2], // 8px
    normal: SpacingTokens[4], // 16px
    loose: SpacingTokens[6], // 24px
    extraLoose: SpacingTokens[8], // 32px
  },

  // 布局间距
  layout: {
    section: SpacingTokens[12], // 48px
    page: SpacingTokens[16], // 64px
    container: SpacingTokens[20], // 80px
  },
} as const;

// 边框圆角
export const BorderRadiusTokens = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const;

// 阴影
export const ShadowTokens = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// CSS变量映射
export const SpacingCSSVariables = {
  // 间距
  '--spacing-xs': SemanticSpacing.padding.xs,
  '--spacing-sm': SemanticSpacing.padding.sm,
  '--spacing-md': SemanticSpacing.padding.md,
  '--spacing-lg': SemanticSpacing.padding.lg,
  '--spacing-xl': SemanticSpacing.padding.xl,

  // 圆角
  '--border-radius-sm': BorderRadiusTokens.sm,
  '--border-radius-md': BorderRadiusTokens.md,
  '--border-radius-lg': BorderRadiusTokens.lg,
  '--border-radius-xl': BorderRadiusTokens.xl,

  // 阴影
  '--shadow-sm': ShadowTokens.sm,
  '--shadow-md': ShadowTokens.md,
  '--shadow-lg': ShadowTokens.lg,
} as const;

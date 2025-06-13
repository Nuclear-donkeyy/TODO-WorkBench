// 模拟网络延迟
export const delay = (ms: number = 500): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

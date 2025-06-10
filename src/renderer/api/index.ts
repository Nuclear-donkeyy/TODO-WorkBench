// API模块统一导出
export * from './TODOList';
export * from './types/todo';

// 导入所有TODO相关的API
import * as TodoAPI from './TODOList';

// 统一的API对象
export const API = {
  todo: TodoAPI,
};

// 默认导出
export default API;

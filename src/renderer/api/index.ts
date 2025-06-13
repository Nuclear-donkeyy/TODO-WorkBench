// 导入所有TODO相关的API
import * as TodoAPI from './TODOList';
import * as CalendarAPI from './Calendar';
import * as NoteAPI from './Note';
// 统一的API对象
export const API = {
  todo: TodoAPI,
  calendar: CalendarAPI,
  note: NoteAPI,
};

// 默认导出
export default API;

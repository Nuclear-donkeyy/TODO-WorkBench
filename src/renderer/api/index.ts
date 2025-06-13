// 导入所有TODO相关的API
import * as TodoAPI from './TODOList';
import * as CalendarAPI from './Calendar';
import * as NoteAPI from './Note';
import * as CheckInAPI from './CheckIn';
import * as PlanTaskAPI from './PlanTask';
// 统一的API对象
export const API = {
  todo: TodoAPI,
  calendar: CalendarAPI,
  note: NoteAPI,
  checkIn: CheckInAPI,
  planTask: PlanTaskAPI,
};

// 默认导出
export default API;

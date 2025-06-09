/**
 * 核心数据类型定义
 */

// Todo项的基础接口
export interface ITodo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string | undefined;
}

// 创建Todo项的输入类型
export interface ICreateTodoInput {
  text: string;
}

// 更新Todo项的输入类型
export interface IUpdateTodoInput {
  text?: string;
  completed?: boolean;
}

// 过滤器类型
export type TodoFilter = 'all' | 'active' | 'completed';

// API响应的基础接口
export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// API响应 - 获取所有todos
export interface IGetTodosResponse extends IApiResponse<ITodo[]> {
  count?: number;
}

// API响应 - 创建todo
export interface ICreateTodoResponse extends IApiResponse<ITodo> {}

// API响应 - 更新todo
export interface IUpdateTodoResponse extends IApiResponse<ITodo> {}

// API响应 - 删除todos
export interface IDeleteTodosResponse extends IApiResponse {
  deletedCount?: number;
}

// 数据库相关类型
export interface IDatabaseTodo {
  id: number;
  text: string;
  completed: number; // SQLite中boolean存储为0/1
  created_at: string;
  updated_at?: string;
}

// 连接状态类型
export interface IConnectionStatus {
  isOnline: boolean;
  message: string;
}

// 消息类型
export type MessageType = 'success' | 'error' | 'info' | 'warning';

// 前端消息接口
export interface IMessage {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
}

// 应用配置接口
export interface IAppConfig {
  apiBaseUrl: string;
  defaultFilter: TodoFilter;
  autoSyncInterval?: number;
  enableOfflineMode: boolean;
}

// Express请求扩展接口
export interface IExtendedRequest extends Express.Request {
  body: any;
  params: { [key: string]: string };
  query: { [key: string]: string | string[] | undefined };
}

// Express响应扩展接口
export interface IExtendedResponse extends Express.Response {
  json(body: IApiResponse): this;
}

// 数据服务接口
export interface IDataService {
  init?(): Promise<void>;
  getAllTodos(): Promise<ITodo[]>;
  createTodo(text: string): Promise<ITodo>;
  updateTodo(id: number, updates: IUpdateTodoInput): Promise<ITodo | null>;
  deleteTodo(id: number): Promise<boolean>;
  deleteCompletedTodos(): Promise<number>;
  toggleTodo(id: number, completed: boolean): Promise<ITodo | null>;
  editTodo(id: number, text: string): Promise<ITodo | null>;
  getConnectionStatus(): IConnectionStatus;
}

// API客户端接口
export interface ITodoAPI {
  baseURL: string;
  isServerRunning: boolean;
  checkServerConnection(): Promise<void>;
  getAllTodos(): Promise<ITodo[]>;
  createTodo(text: string): Promise<ITodo>;
  updateTodo(id: number, updates: IUpdateTodoInput): Promise<ITodo>;
  deleteTodo(id: number): Promise<boolean>;
  deleteCompletedTodos(): Promise<number>;
  toggleTodo(id: number, completed: boolean): Promise<ITodo>;
  editTodo(id: number, text: string): Promise<ITodo>;
}

// 本地存储接口
export interface ILocalStorage {
  storageKey: string;
  getAllTodos(): ITodo[];
  saveTodos(todos: ITodo[]): void;
  createTodo(text: string): ITodo;
  updateTodo(id: number, updates: IUpdateTodoInput): ITodo | null;
  deleteTodo(id: number): boolean;
  deleteCompletedTodos(): number;
}

// 数据库接口
export interface IDatabase {
  dbPath: string;
  init(): void;
  createTables(): void;
  getAllTodos(): Promise<ITodo[]>;
  createTodo(text: string): Promise<ITodo>;
  updateTodo(id: number, updates: IUpdateTodoInput): Promise<boolean>;
  deleteTodo(id: number): Promise<boolean>;
  deleteCompletedTodos(): Promise<number>;
  close(): void;
}

// TodoApp类接口
export interface ITodoApp {
  todos: ITodo[];
  currentFilter: TodoFilter;
  dataService: IDataService | null;

  init(): Promise<void>;
  loadTodos(): Promise<void>;
  addTodo(): Promise<void>;
  toggleTodo(id: number): Promise<void>;
  deleteTodo(id: number): Promise<void>;
  editTodo(id: number, newText: string): Promise<void>;
  clearCompleted(): Promise<void>;
  setFilter(filter: TodoFilter): void;
  render(): void;
}

// 事件类型
export type TodoEventType =
  | 'todo:created'
  | 'todo:updated'
  | 'todo:deleted'
  | 'todo:completed'
  | 'todos:cleared'
  | 'connection:changed';

// 事件数据接口
export interface ITodoEvent {
  type: TodoEventType;
  data?: any;
  timestamp: string;
}

// 主进程配置接口
export interface IElectronConfig {
  width: number;
  height: number;
  webPreferences: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    enableRemoteModule: boolean;
  };
  icon?: string;
  show: boolean;
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
}

// 服务器配置接口
export interface IServerConfig {
  port: number;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  database: {
    path: string;
  };
}

// 错误类型
export class TodoError extends Error {
  public code: string;
  public statusCode: number;

  constructor(
    message: string,
    code: string = 'TODO_ERROR',
    statusCode: number = 500
  ) {
    super(message);
    this.name = 'TodoError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 常量类型
export const TODO_FILTERS = ['all', 'active', 'completed'] as const;
export const MESSAGE_TYPES = ['success', 'error', 'info', 'warning'] as const;
export const TODO_EVENTS = [
  'todo:created',
  'todo:updated',
  'todo:deleted',
  'todo:completed',
  'todos:cleared',
  'connection:changed',
] as const;

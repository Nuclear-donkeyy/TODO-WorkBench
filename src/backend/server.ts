import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import Database from './database';
import {
  IApiResponse,
  ICreateTodoInput,
  IUpdateTodoInput,
  IGetTodosResponse,
  ICreateTodoResponse,
  IUpdateTodoResponse,
  IDeleteTodosResponse,
  TodoError,
  IServerConfig,
} from '../types';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// 服务器配置
const serverConfig: IServerConfig = {
  port: PORT,
  cors: {
    origin: ['http://localhost:3000', 'file://', 'app://rse'],
    credentials: true,
  },
  database: {
    path: './todos.db',
  },
};

// 初始化数据库
const db = new Database();

// 中间件配置
app.use(cors(serverConfig.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查接口
app.get('/health', (req: Request, res: Response): void => {
  const response: IApiResponse = {
    success: true,
    message: 'TODO WorkBench Backend Server is running',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      status: 'healthy',
    },
  };
  res.json(response);
});

// =====================
// TODO API 路由
// =====================

// GET /api/todos - 获取所有TODO项
app.get('/api/todos', async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await db.getAllTodos();
    const response: IGetTodosResponse = {
      success: true,
      data: todos,
      count: todos.length,
      message: '获取待办事项成功',
    };
    res.json(response);
  } catch (error) {
    console.error('获取todos失败:', error);

    if (error instanceof TodoError) {
      const response: IApiResponse = {
        success: false,
        message: error.message,
        error: error.code,
      };
      res.status(error.statusCode).json(response);
    } else {
      const response: IApiResponse = {
        success: false,
        message: '获取待办事项失败',
        error: 'UNKNOWN_ERROR',
      };
      res.status(500).json(response);
    }
  }
});

// POST /api/todos - 创建新的TODO项
app.post('/api/todos', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text }: ICreateTodoInput = req.body;

    if (!text || text.trim() === '') {
      const response: IApiResponse = {
        success: false,
        message: '待办事项文本不能为空',
      };
      res.status(400).json(response);
      return;
    }

    const newTodo = await db.createTodo(text.trim());
    const response: ICreateTodoResponse = {
      success: true,
      data: newTodo,
      message: '待办事项创建成功',
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('创建todo失败:', error);

    if (error instanceof TodoError) {
      const response: IApiResponse = {
        success: false,
        message: error.message,
        error: error.code,
      };
      res.status(error.statusCode).json(response);
    } else {
      const response: IApiResponse = {
        success: false,
        message: '创建待办事项失败',
        error: 'UNKNOWN_ERROR',
      };
      res.status(500).json(response);
    }
  }
});

// PUT /api/todos/:id - 更新TODO项
app.put(
  '/api/todos/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id, 10);
      const updates: IUpdateTodoInput = req.body;

      if (!id || isNaN(id)) {
        const response: IApiResponse = {
          success: false,
          message: '无效的待办事项ID',
        };
        res.status(400).json(response);
        return;
      }

      const updated = await db.updateTodo(id, updates);

      if (updated) {
        // 获取更新后的数据
        const todos = await db.getAllTodos();
        const updatedTodo = todos.find(todo => todo.id === id);

        if (updatedTodo) {
          const response: IUpdateTodoResponse = {
            success: true,
            data: updatedTodo,
            message: '待办事项更新成功',
          };
          res.json(response);
        } else {
          const response: IApiResponse = {
            success: false,
            message: '更新后无法找到待办事项',
          };
          res.status(404).json(response);
        }
      } else {
        const response: IApiResponse = {
          success: false,
          message: '待办事项不存在',
        };
        res.status(404).json(response);
      }
    } catch (error) {
      console.error('更新todo失败:', error);

      if (error instanceof TodoError) {
        const response: IApiResponse = {
          success: false,
          message: error.message,
          error: error.code,
        };
        res.status(error.statusCode).json(response);
      } else {
        const response: IApiResponse = {
          success: false,
          message: '更新待办事项失败',
          error: 'UNKNOWN_ERROR',
        };
        res.status(500).json(response);
      }
    }
  }
);

// DELETE /api/todos/:id - 删除单个TODO项
app.delete(
  '/api/todos/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id, 10);

      if (!id || isNaN(id)) {
        const response: IApiResponse = {
          success: false,
          message: '无效的待办事项ID',
        };
        res.status(400).json(response);
        return;
      }

      const deleted = await db.deleteTodo(id);

      if (deleted) {
        const response: IApiResponse = {
          success: true,
          message: '待办事项删除成功',
        };
        res.json(response);
      } else {
        const response: IApiResponse = {
          success: false,
          message: '待办事项不存在',
        };
        res.status(404).json(response);
      }
    } catch (error) {
      console.error('删除todo失败:', error);

      if (error instanceof TodoError) {
        const response: IApiResponse = {
          success: false,
          message: error.message,
          error: error.code,
        };
        res.status(error.statusCode).json(response);
      } else {
        const response: IApiResponse = {
          success: false,
          message: '删除待办事项失败',
          error: 'UNKNOWN_ERROR',
        };
        res.status(500).json(response);
      }
    }
  }
);

// DELETE /api/todos/completed - 删除所有已完成的TODO项
app.delete(
  '/api/todos/completed',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedCount = await db.deleteCompletedTodos();
      const response: IDeleteTodosResponse = {
        success: true,
        message: `成功删除${deletedCount}个已完成的待办事项`,
        deletedCount,
      };
      res.json(response);
    } catch (error) {
      console.error('删除已完成todos失败:', error);

      if (error instanceof TodoError) {
        const response: IApiResponse = {
          success: false,
          message: error.message,
          error: error.code,
        };
        res.status(error.statusCode).json(response);
      } else {
        const response: IApiResponse = {
          success: false,
          message: '删除已完成待办事项失败',
          error: 'UNKNOWN_ERROR',
        };
        res.status(500).json(response);
      }
    }
  }
);

// 404 处理
app.use('*', (req: Request, res: Response): void => {
  const response: IApiResponse = {
    success: false,
    message: '接口不存在',
  };
  res.status(404).json(response);
});

// 全局错误处理中间件
app.use(
  (error: Error, req: Request, res: Response, _next: NextFunction): void => {
    console.error('服务器错误:', error);

    if (error instanceof TodoError) {
      const response: IApiResponse = {
        success: false,
        message: error.message,
        error: error.code,
      };
      res.status(error.statusCode).json(response);
    } else {
      const response: IApiResponse = {
        success: false,
        message: '服务器内部错误',
        error:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'INTERNAL_SERVER_ERROR',
      };
      res.status(500).json(response);
    }
  }
);

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`TODO WorkBench Backend Server 启动成功！`);
  console.log(`服务器地址: http://localhost:${PORT}`);
  console.log(`API文档: http://localhost:${PORT}/health`);
  console.log(`启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`TypeScript模式已启用`);
});

// 优雅关闭
process.on('SIGTERM', (): void => {
  console.log('🛑 接收到SIGTERM信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ HTTP服务器已关闭');
    db.close();
    process.exit(0);
  });
});

process.on('SIGINT', (): void => {
  console.log('🛑 接收到SIGINT信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ HTTP服务器已关闭');
    db.close();
    process.exit(0);
  });
});

export default app;

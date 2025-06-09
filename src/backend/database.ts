import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import {
  ITodo,
  IUpdateTodoInput,
  IDatabaseTodo,
  IDatabase,
  TodoError,
} from '../types';

class Database implements IDatabase {
  public dbPath: string;
  private db: sqlite3.Database | null = null;

  constructor() {
    // 数据库文件路径
    this.dbPath = path.join(__dirname, 'todos.db');
    this.init();
  }

  // 初始化数据库连接
  public init(): void {
    this.db = new sqlite3.Database(this.dbPath, (err: Error | null) => {
      if (err) {
        console.error('数据库连接失败:', err.message);
        throw new TodoError('数据库连接失败', 'DB_CONNECTION_ERROR', 500);
      } else {
        console.log('✅ 成功连接到SQLite数据库');
        this.createTables();
      }
    });
  }

  // 创建表结构
  public createTables(): void {
    if (!this.db) {
      throw new TodoError('数据库未初始化', 'DB_NOT_INITIALIZED', 500);
    }

    const createTodosTable = `
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

    this.db.run(createTodosTable, (err: Error | null) => {
      if (err) {
        console.error('创建todos表失败:', err.message);
        throw new TodoError('创建数据表失败', 'DB_TABLE_CREATION_ERROR', 500);
      } else {
        console.log('✅ todos表已创建或已存在');
      }
    });
  }

  // 获取所有TODO项
  public getAllTodos(): Promise<ITodo[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new TodoError('数据库未初始化', 'DB_NOT_INITIALIZED', 500));
        return;
      }

      const sql = 'SELECT * FROM todos ORDER BY created_at DESC';
      this.db.all(sql, [], (err: Error | null, rows: IDatabaseTodo[]) => {
        if (err) {
          reject(
            new TodoError(
              `获取todos失败: ${err.message}`,
              'DB_QUERY_ERROR',
              500
            )
          );
        } else {
          // 转换数据格式以匹配前端
          const todos: ITodo[] = rows.map((row: IDatabaseTodo) => ({
            id: row.id,
            text: row.text,
            completed: Boolean(row.completed),
            createdAt: row.created_at,
            updatedAt: row.updated_at || undefined,
          }));
          resolve(todos);
        }
      });
    });
  }

  // 创建新的TODO项
  public createTodo(text: string): Promise<ITodo> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new TodoError('数据库未初始化', 'DB_NOT_INITIALIZED', 500));
        return;
      }

      if (!text || text.trim() === '') {
        reject(new TodoError('待办事项文本不能为空', 'INVALID_INPUT', 400));
        return;
      }

      const sql = 'INSERT INTO todos (text, completed) VALUES (?, ?)';
      this.db.run(sql, [text.trim(), false], (err: Error | null) => {
        if (err) {
          reject(
            new TodoError(
              `创建todo失败: ${err.message}`,
              'DB_INSERT_ERROR',
              500
            )
          );
        } else {
          // 返回新创建的TODO项
          const getTodoSql =
            'SELECT * FROM todos WHERE id = last_insert_rowid()';
          if (!this.db) {
            reject(new TodoError('数据库连接丢失', 'DB_CONNECTION_LOST', 500));
            return;
          }

          this.db.get(
            getTodoSql,
            [],
            (err: Error | null, row: IDatabaseTodo) => {
              if (err) {
                reject(
                  new TodoError(
                    `获取新创建的todo失败: ${err.message}`,
                    'DB_QUERY_ERROR',
                    500
                  )
                );
              } else if (!row) {
                reject(
                  new TodoError('新创建的todo不存在', 'TODO_NOT_FOUND', 404)
                );
              } else {
                const todo: ITodo = {
                  id: row.id,
                  text: row.text,
                  completed: Boolean(row.completed),
                  createdAt: row.created_at,
                  updatedAt: row.updated_at || undefined,
                };
                resolve(todo);
              }
            }
          );
        }
      });
    });
  }

  // 更新TODO项
  public updateTodo(id: number, updates: IUpdateTodoInput): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new TodoError('数据库未初始化', 'DB_NOT_INITIALIZED', 500));
        return;
      }

      if (!id || isNaN(id)) {
        reject(new TodoError('无效的todo ID', 'INVALID_ID', 400));
        return;
      }

      const fields: string[] = [];
      const values: (string | boolean)[] = [];

      if (updates.text !== undefined) {
        if (updates.text.trim() === '') {
          reject(new TodoError('待办事项文本不能为空', 'INVALID_INPUT', 400));
          return;
        }
        fields.push('text = ?');
        values.push(updates.text.trim());
      }

      if (updates.completed !== undefined) {
        fields.push('completed = ?');
        values.push(updates.completed);
      }

      if (fields.length === 0) {
        resolve(false);
        return;
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id.toString());

      const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
      this.db.run(
        sql,
        values,
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(
              new TodoError(
                `更新todo失败: ${err.message}`,
                'DB_UPDATE_ERROR',
                500
              )
            );
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  // 删除TODO项
  public deleteTodo(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new TodoError('数据库未初始化', 'DB_NOT_INITIALIZED', 500));
        return;
      }

      if (!id || isNaN(id)) {
        reject(new TodoError('无效的todo ID', 'INVALID_ID', 400));
        return;
      }

      const sql = 'DELETE FROM todos WHERE id = ?';
      this.db.run(
        sql,
        [id],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(
              new TodoError(
                `删除todo失败: ${err.message}`,
                'DB_DELETE_ERROR',
                500
              )
            );
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  // 删除所有已完成的TODO项
  public deleteCompletedTodos(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new TodoError('数据库未初始化', 'DB_NOT_INITIALIZED', 500));
        return;
      }

      const sql = 'DELETE FROM todos WHERE completed = TRUE';
      this.db.run(
        sql,
        [],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(
              new TodoError(
                `删除已完成todos失败: ${err.message}`,
                'DB_DELETE_ERROR',
                500
              )
            );
          } else {
            resolve(this.changes);
          }
        }
      );
    });
  }

  // 关闭数据库连接
  public close(): void {
    if (this.db) {
      this.db.close((err: Error | null) => {
        if (err) {
          console.error('关闭数据库失败:', err.message);
        } else {
          console.log('✅ 数据库连接已关闭');
        }
      });
    }
  }
}

export default Database;

import React, { useState, useEffect } from 'react';
import { Button, Spin, message, Form, Input, DatePicker } from 'antd';
import TODOItem from '../../components/TODOItem';
import { API, TodoItem, CreateTodoParams } from '../../api';
import './index.less';

const { RangePicker } = DatePicker;

type CreateFormFields = {
  taskname: string;
  taskDesc?: string;
  taskPeriod?: any;
};

export default function TODOPage(): JSX.Element {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm] = Form.useForm();

  // 获取TODO列表
  const fetchTodos = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await API.todo.getTodoList({ page: 1, limit: 20 });
      if (response.success && response.data) {
        setTodos(response.data.items);
      } else {
        message.error(response.error || '获取TODO列表失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 切换创建表单显示状态
  const toggleCreateForm = (): void => {
    setShowCreateForm(!showCreateForm);
    if (!showCreateForm) {
      createForm.resetFields(); // 展开时重置表单
    }
  };

  // 表单提交 - 创建新的TODO
  const handleCreateSubmit = async (
    values: CreateFormFields
  ): Promise<void> => {
    setCreating(true);
    try {
      const colors = ['#667eea', '#00d4aa', '#ef4444', '#f59e0b', '#3b82f6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // 处理日期范围
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (values.taskPeriod && Array.isArray(values.taskPeriod)) {
        startDate = values.taskPeriod[0]?.format('YYYY-MM-DD');
        endDate = values.taskPeriod[1]?.format('YYYY-MM-DD');
      }

      const createParams: CreateTodoParams = {
        content: values.taskname,
        color: randomColor,
        ...(values.taskDesc !== undefined && { description: values.taskDesc }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
      };

      const response = await API.todo.createTodo(createParams);

      if (response.success) {
        message.success(response.message || '创建成功');
        setShowCreateForm(false); // 关闭表单
        createForm.resetFields(); // 重置表单
        fetchTodos(); // 刷新列表
      } else {
        message.error(response.error || '创建失败');
      }
    } catch (error) {
      message.error('创建失败，请稍后重试');
    } finally {
      setCreating(false);
    }
  };

  // 删除TODO
  const handleDeleteTodo = async (id: string): Promise<void> => {
    try {
      const response = await API.todo.deleteTodo(id);
      if (response.success) {
        message.success(response.message || '删除成功');
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } else {
        message.error(response.error || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请稍后重试');
    }
  };

  // 切换完成状态
  const handleToggleComplete = async (id: string): Promise<void> => {
    try {
      const response = await API.todo.toggleTodoComplete(id);
      if (response.success && response.data) {
        message.success(response.message);
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? response.data! : todo))
        );
      } else {
        message.error(response.error || '操作失败');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className='todo-page-container'>
      <div className='todo-header'>
        <h2>我的任务</h2>
        <div className='todo-actions'>
          <Button type='primary' onClick={toggleCreateForm}>
            {showCreateForm ? '取消添加' : '添加任务'}
          </Button>
          <Button onClick={fetchTodos} disabled={loading}>
            刷新
          </Button>
        </div>
      </div>

      {/* 创建任务表单 */}
      {showCreateForm && (
        <div className='create-form-container'>
          <Form
            form={createForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={handleCreateSubmit}
            style={{ width: '100%' }}
          >
            <Form.Item
              label='任务名称'
              name='taskname'
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input placeholder='请输入任务名称' />
            </Form.Item>

            <Form.Item label='任务描述' name='taskDesc'>
              <Input.TextArea placeholder='请输入任务描述（可选）' rows={3} />
            </Form.Item>

            <Form.Item label='任务期限' name='taskPeriod'>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              <div className='form-actions'>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={creating}
                  disabled={creating}
                >
                  {creating ? '创建中...' : '创建任务'}
                </Button>
                <Button onClick={toggleCreateForm} disabled={creating}>
                  取消
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      )}

      <Spin spinning={loading}>
        <div className='todo-list'>
          {todos.length === 0 ? (
            <div className='empty-state'>
              <p>暂无任务，点击添加任务创建第一个任务吧！</p>
            </div>
          ) : (
            todos.map(todo => (
              <TODOItem
                key={todo.id}
                id={todo.id}
                content={todo.content}
                color={todo.color}
                {...(todo.description !== undefined && {
                  description: todo.description,
                })}
                {...(todo.startDate !== undefined && {
                  startDate: todo.startDate,
                })}
                {...(todo.endDate !== undefined && { endDate: todo.endDate })}
                onComplete={() => handleToggleComplete(todo.id)}
                onDelete={() => handleDeleteTodo(todo.id)}
                refresh={fetchTodos}
              />
            ))
          )}
        </div>
      </Spin>
    </div>
  );
}

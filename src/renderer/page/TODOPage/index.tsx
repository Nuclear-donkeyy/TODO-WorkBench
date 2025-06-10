import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Spin,
  message,
  Form,
  Input,
  DatePicker,
  Tabs,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Card, CardHeader, CardBody } from '../../design-system/components';
import TODOItem from '../../components/TODOItem';
import { API } from '../../api';

import dayjs from 'dayjs';
import './index.less';
import { CreateTodoParams, TodoItem } from '@/renderer/api/TODOList/types';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

type CreateFormFields = {
  taskname: string;
  taskDesc?: string;
  taskPeriod?: [dayjs.Dayjs, dayjs.Dayjs];
};

export default function TODOPage(): JSX.Element {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [createForm] = Form.useForm();

  // 根据完成状态分组TODO项
  const { activeTodos, completedTodos } = useMemo(() => {
    const active = todos.filter(todo => !todo.completed);
    const completed = todos.filter(todo => todo.completed);
    return { activeTodos: active, completedTodos: completed };
  }, [todos]);

  // 获取TODO列表
  const fetchTodos = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await API.todo.getTodoList({ page: 1, limit: 50 });
      if (response.success && response.data) {
        // 按创建时间倒序排列，未完成的排在前面
        const sortedTodos = response.data.items.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setTodos(sortedTodos);
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
      createForm.resetFields();
    }
  };

  // 表单提交 - 创建新的TODO
  const handleCreateSubmit = async (
    values: CreateFormFields
  ): Promise<void> => {
    setCreating(true);
    try {
      const colors = [
        '#667eea',
        '#00d4aa',
        '#ef4444',
        '#f59e0b',
        '#3b82f6',
        '#8b5cf6',
        '#06b6d4',
        '#10b981',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

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
        setShowCreateForm(false);
        createForm.resetFields();
        fetchTodos();
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
        const updatedTodo = response.data;
        message.success(
          updatedTodo.completed ? '任务已完成！' : '任务重新激活'
        );
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo))
        );
      } else {
        message.error(response.error || '操作失败');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 渲染TODO列表
  const renderTodoList = (todoList: TodoItem[]) => {
    if (todoList.length === 0) {
      return (
        <div className='empty-state'>
          <div className='empty-icon'>
            {activeTab === 'active' ? (
              <ClockCircleOutlined style={{ fontSize: 48, color: '#d1d5db' }} />
            ) : (
              <CheckCircleOutlined style={{ fontSize: 48, color: '#d1d5db' }} />
            )}
          </div>
          <p className='empty-text'>
            {activeTab === 'active' ? '暂无进行中的任务' : '暂无已完成的任务'}
          </p>
          {activeTab === 'active' && (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={toggleCreateForm}
              className='empty-action-btn'
            >
              创建第一个任务
            </Button>
          )}
        </div>
      );
    }

    return todoList.map(todo => (
      <TODOItem
        key={todo.id}
        id={todo.id}
        content={todo.content}
        color={todo.color}
        completed={todo.completed}
        {...(todo.description !== undefined && {
          description: todo.description,
        })}
        {...(todo.startDate !== undefined && { startDate: todo.startDate })}
        {...(todo.endDate !== undefined && { endDate: todo.endDate })}
        onComplete={() => handleToggleComplete(todo.id)}
        onDelete={() => handleDeleteTodo(todo.id)}
        refresh={fetchTodos}
      />
    ));
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className='todo-page-container'>
      {/* 页面头部 */}
      <Card variant='elevated' className='todo-header-card' padding='lg'>
        <div className='todo-header-content'>
          <div className='header-title'>
            <h2>我的任务</h2>
            <div className='task-stats'>
              <span className='stat-item active'>
                <ClockCircleOutlined />
                {activeTodos.length} 进行中
              </span>
              <span className='stat-item completed'>
                <CheckCircleOutlined />
                {completedTodos.length} 已完成
              </span>
            </div>
          </div>
          <div className='todo-actions'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={toggleCreateForm}
              className='create-btn'
            >
              {showCreateForm ? '取消添加' : '添加任务'}
            </Button>
            <Button
              onClick={fetchTodos}
              disabled={loading}
              className='refresh-btn'
            >
              刷新
            </Button>
          </div>
        </div>
      </Card>

      {/* 滚动容器 */}
      <div className='todo-main-content'>
        {/* 创建任务表单 */}
        {showCreateForm && (
          <Card variant='elevated' className='create-form-card' padding='none'>
            <CardHeader>
              <h3>创建新任务</h3>
            </CardHeader>
            <CardBody>
              <Form
                form={createForm}
                layout='vertical'
                onFinish={handleCreateSubmit}
                className='create-form'
              >
                <Form.Item
                  label='任务名称'
                  name='taskname'
                  rules={[{ required: true, message: '请输入任务名称' }]}
                >
                  <Input placeholder='请输入任务名称' size='large' />
                </Form.Item>

                <Form.Item label='任务描述' name='taskDesc'>
                  <Input.TextArea
                    placeholder='请输入任务描述（可选）'
                    rows={3}
                    showCount
                    maxLength={200}
                  />
                </Form.Item>

                <Form.Item label='任务期限' name='taskPeriod'>
                  <RangePicker
                    style={{ width: '100%' }}
                    size='large'
                    placeholder={['开始日期', '结束日期']}
                  />
                </Form.Item>

                <Form.Item>
                  <div className='form-actions'>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={creating}
                      disabled={creating}
                      size='large'
                      icon={<PlusOutlined />}
                    >
                      {creating ? '创建中...' : '创建任务'}
                    </Button>
                    <Button
                      onClick={toggleCreateForm}
                      disabled={creating}
                      size='large'
                    >
                      取消
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </CardBody>
          </Card>
        )}

        {/* 任务列表区域 */}
        <Card variant='elevated' className='todo-content-card' padding='none'>
          <div className='todo-tabs-container'>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className='todo-tabs'
              size='large'
            >
              <TabPane
                tab={
                  <Badge
                    count={activeTodos.length}
                    showZero
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    <span className='tab-label'>
                      <ClockCircleOutlined />
                      进行中
                    </span>
                  </Badge>
                }
                key='active'
              >
                <div className='todo-list-wrapper'>
                  <Spin spinning={loading}>
                    <div className='todo-list active-todos'>
                      {renderTodoList(activeTodos)}
                    </div>
                  </Spin>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <Badge
                    count={completedTodos.length}
                    showZero
                    style={{ backgroundColor: '#52c41a' }}
                  >
                    <span className='tab-label'>
                      <CheckCircleOutlined />
                      已完成
                    </span>
                  </Badge>
                }
                key='completed'
              >
                <div className='todo-list-wrapper'>
                  <Spin spinning={loading}>
                    <div className='todo-list completed-todos'>
                      {renderTodoList(completedTodos)}
                    </div>
                  </Spin>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}

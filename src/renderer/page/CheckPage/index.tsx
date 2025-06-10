import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Badge,
  Progress,
  Modal,
  Form,
  Input,
  Popconfirm,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { SkeletonLoading } from '../../components/Loading';
import { useLoading, LoadingKeys } from '../../hooks/useLoading';
import './index.less';

interface CheckInTask {
  id: string;
  title: string;
  description: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  streak: number; // 连续打卡天数
  progress?: number; // 进度百分比
}

interface TaskFormData {
  title: string;
  description?: string;
}

export default function CheckPage(): JSX.Element {
  const [tasks, setTasks] = useState<CheckInTask[]>([
    {
      id: '1',
      title: '晚上节食',
      description: '健康、节制，比前一天的自己更好',
      isCheckedIn: false,
      streak: 7,
      progress: 70,
    },
    {
      id: '2',
      title: '好好睡觉',
      description: 'Go healthy, just sleep',
      isCheckedIn: true,
      checkedInAt: new Date().toLocaleString(),
      streak: 12,
      progress: 100,
    },
    {
      id: '3',
      title: '技术学习',
      description: '学习技术，争取35不改咯',
      isCheckedIn: false,
      streak: 3,
      progress: 25,
    },
    {
      id: '4',
      title: '步数10000+',
      description: '保持活动',
      isCheckedIn: false,
      streak: 5,
      progress: 45,
    },
    {
      id: '5',
      title: '学习强国',
      description: '每日学习任务',
      isCheckedIn: false,
      streak: 15,
      progress: 80,
    },
    {
      id: '6',
      title: '体重记录',
      description: '记录体重变化',
      isCheckedIn: false,
      streak: 2,
      progress: 15,
    },
  ]);

  const [todayTotal, setTodayTotal] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CheckInTask | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [form] = Form.useForm();

  // 使用统一的加载状态管理
  const { isLoading, withLoading } = useLoading();

  useEffect(() => {
    setTodayTotal(tasks.length);
    setTodayCompleted(tasks.filter(task => task.isCheckedIn).length);
  }, [tasks]);

  // 模拟初始加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckIn = withLoading(
    LoadingKeys.CHECKIN,
    async (taskId: string) => {
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId && !task.isCheckedIn) {
            message.success(`${task.title} 打卡成功！`);
            return {
              ...task,
              isCheckedIn: true,
              checkedInAt: new Date().toLocaleString(),
              streak: task.streak + 1,
              progress: Math.min(100, (task.progress ?? 0) + 10),
            };
          }
          return task;
        })
      );
    }
  );

  const handleDeleteTask = withLoading(
    LoadingKeys.DELETE,
    async (taskId: string) => {
      // 模拟删除请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const task = tasks.find(t => t.id === taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      message.success(`已删除打卡项：${task?.title}`);
    }
  );

  const handleResetCheckIn = withLoading(
    LoadingKeys.RESET,
    async (taskId: string) => {
      // 模拟重置请求延迟
      await new Promise(resolve => setTimeout(resolve, 400));

      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId && task.isCheckedIn) {
            message.success(`${task.title} 打卡状态已重置`);
            const { ...resetTask } = task;
            return {
              ...resetTask,
              isCheckedIn: false,
              progress: Math.max(0, (task.progress ?? 0) - 10),
            };
          }
          return task;
        })
      );
    }
  );

  const handleAddTask = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditTask = (task: CheckInTask) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmitTask = withLoading(LoadingKeys.SUBMIT, async () => {
    try {
      const values: TaskFormData = await form.validateFields();

      // 模拟提交请求延迟
      await new Promise(resolve => setTimeout(resolve, 600));

      if (editingTask) {
        // 编辑已有任务
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === editingTask.id
              ? {
                  ...task,
                  title: values.title,
                  description: values.description || '',
                }
              : task
          )
        );
        message.success('打卡项更新成功！');
      } else {
        // 新增任务
        const newTask: CheckInTask = {
          id: Date.now().toString(),
          title: values.title,
          description: values.description || '',
          isCheckedIn: false,
          streak: 0,
          progress: 0,
        };

        setTasks(prevTasks => [...prevTasks, newTask]);
        message.success('新建打卡项成功！');
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  });

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

  // 如果是初始加载，显示骨架屏
  if (isInitialLoading) {
    return (
      <div className='check-page-container'>
        <div className='check-header'>
          <div className='header-content'>
            <h1 className='page-title'>打卡管理</h1>
            <div className='today-stats'>
              <div className='stats-item'>
                <span className='stats-label'>今日完成</span>
                <span className='stats-value'>-/-</span>
              </div>
            </div>
          </div>
          <div className='header-actions'>
            <Button size='large' loading>
              管理模式
            </Button>
            <Button type='primary' size='large' loading>
              新增打卡项
            </Button>
          </div>
        </div>
        <SkeletonLoading type='grid' rows={2} />
      </div>
    );
  }

  return (
    <div className='check-page-container'>
      <div className='check-header'>
        <div className='header-content'>
          <h1 className='page-title'>打卡管理</h1>
          <div className='today-stats'>
            <div className='stats-item'>
              <span className='stats-label'>今日完成</span>
              <span className='stats-value'>
                {todayCompleted}/{todayTotal}
              </span>
            </div>
            {isManageMode && (
              <div className='stats-item'>
                <span className='stats-label'>总打卡项</span>
                <span className='stats-value'>{tasks.length}</span>
              </div>
            )}
            <div className='completion-rate'>
              <Progress
                type='circle'
                size={60}
                percent={
                  todayTotal > 0
                    ? Math.round((todayCompleted / todayTotal) * 100)
                    : 0
                }
                strokeColor='var(--accent-color)'
              />
            </div>
          </div>
        </div>
        <div className='header-actions'>
          <Button
            type={isManageMode ? 'default' : 'primary'}
            size='large'
            className='manage-btn'
            onClick={() => setIsManageMode(!isManageMode)}
          >
            {isManageMode ? '退出管理' : '管理模式'}
          </Button>
          <Button
            type='primary'
            size='large'
            className='add-task-btn'
            icon={<PlusOutlined />}
            onClick={handleAddTask}
          >
            新增打卡项
          </Button>
        </div>
      </div>

      <div className='tasks-grid'>
        {tasks.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-content'>
              <h3>还没有打卡项</h3>
              <p>点击上方&quot;新增打卡项&quot;按钮创建你的第一个打卡项吧</p>
              <Button
                type='primary'
                size='large'
                icon={<PlusOutlined />}
                onClick={handleAddTask}
              >
                立即创建
              </Button>
            </div>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`task-card ${task.isCheckedIn ? 'checked-in' : ''} ${isManageMode ? 'manage-mode' : ''}`}
            >
              <div className='task-header'>
                <div className='task-info'>
                  <Badge
                    count={task.streak}
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      fontSize: '12px',
                    }}
                    title={`连续${task.streak}天`}
                  />
                </div>
                <div className='task-operations'>
                  {task.isCheckedIn && (
                    <div className='check-status'>
                      <span className='check-icon'>✓</span>
                    </div>
                  )}
                  {isManageMode && (
                    <div className='operation-buttons'>
                      <Button
                        type='text'
                        size='small'
                        icon={<EditOutlined />}
                        onClick={() => handleEditTask(task)}
                        className='edit-btn'
                        title='编辑信息'
                      />
                      <Popconfirm
                        title='确定删除这个打卡项吗？'
                        description='删除后将无法恢复'
                        onConfirm={() => handleDeleteTask(task.id)}
                        okText='确定'
                        cancelText='取消'
                        okType='danger'
                      >
                        <Button
                          type='text'
                          size='small'
                          icon={<DeleteOutlined />}
                          className='delete-btn'
                          title='删除打卡项'
                          danger
                          loading={isLoading(LoadingKeys.DELETE)}
                        />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>

              <div className='task-content'>
                <h3 className='task-title'>{task.title}</h3>
                {task.description && (
                  <p className='task-description'>{task.description}</p>
                )}

                {task.progress !== undefined && (
                  <div className='task-progress'>
                    <Progress
                      percent={task.progress}
                      size='small'
                      strokeColor='var(--primary-color)'
                      showInfo={false}
                    />
                    <span className='progress-text'>{task.progress}%</span>
                  </div>
                )}

                {task.isCheckedIn && task.checkedInAt && (
                  <div className='check-time'>
                    <span>已打卡：{task.checkedInAt}</span>
                  </div>
                )}
              </div>

              {!isManageMode && (
                <div className='task-actions'>
                  {task.isCheckedIn ? (
                    <div className='checked-actions'>
                      <Button
                        className='checked-btn'
                        disabled
                        icon={<span>✓</span>}
                      >
                        已打卡
                      </Button>
                      <Popconfirm
                        title='确定重置打卡状态吗？'
                        description='重置后可以重新打卡'
                        onConfirm={() => handleResetCheckIn(task.id)}
                        okText='确定'
                        cancelText='取消'
                      >
                        <Button
                          type='text'
                          size='small'
                          className='reset-btn'
                          loading={isLoading(LoadingKeys.RESET)}
                        >
                          重置
                        </Button>
                      </Popconfirm>
                    </div>
                  ) : (
                    <Button
                      type='primary'
                      className='check-btn'
                      onClick={() => handleCheckIn(task.id)}
                      loading={isLoading(LoadingKeys.CHECKIN)}
                    >
                      打卡
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 新增/编辑打卡项弹窗 */}
      <Modal
        title={editingTask ? '编辑打卡项' : '新增打卡项'}
        open={isModalOpen}
        onOk={handleSubmitTask}
        onCancel={handleCancel}
        okText={editingTask ? '保存' : '创建'}
        cancelText='取消'
        confirmLoading={isLoading(LoadingKeys.SUBMIT)}
        width={480}
        className='task-modal'
      >
        <Form form={form} layout='vertical' requiredMark={false}>
          <Form.Item
            name='title'
            label='打卡项名称'
            rules={[
              { required: true, message: '请输入打卡项名称' },
              { max: 30, message: '名称不能超过30个字符' },
            ]}
          >
            <Input placeholder='请输入打卡项名称' showCount maxLength={30} />
          </Form.Item>

          <Form.Item
            name='description'
            label='描述说明'
            rules={[{ max: 150, message: '描述不能超过150个字符' }]}
          >
            <Input.TextArea
              placeholder='请输入描述说明（可选）'
              rows={4}
              showCount
              maxLength={150}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

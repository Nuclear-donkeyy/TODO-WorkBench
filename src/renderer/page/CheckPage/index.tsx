import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Form, Input, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CheckTaskCard, { CheckInTask } from '../../components/CheckTaskCard';
import './index.less';

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
  const [form] = Form.useForm();

  // 表单提交的加载状态
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setTodayTotal(tasks.length);
    setTodayCompleted(tasks.filter(task => task.isCheckedIn).length);
  }, [tasks]);

  const handleCheckIn = async (taskId: string): Promise<void> => {
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
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    // 模拟删除请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    const task = tasks.find(t => t.id === taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    message.success(`已删除打卡项：${task?.title}`);
  };

  const handleResetCheckIn = async (taskId: string): Promise<void> => {
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
  };

  const handleAddTask = (): void => {
    setEditingTask(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditTask = (task: CheckInTask): void => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
    });
    setIsModalOpen(true);
  };

  const handleUpdateCheckItem = async (): Promise<void> => {
    setSubmitLoading(true);
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
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

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
            </div>
          </div>
        ) : (
          tasks.map(task => (
            <CheckTaskCard
              key={task.id}
              task={task}
              isManageMode={isManageMode}
              onCheckIn={handleCheckIn}
              onResetCheckIn={handleResetCheckIn}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))
        )}
      </div>

      {/* 新增/编辑打卡项弹窗 */}
      <Modal
        title={editingTask ? '编辑打卡项' : '新增打卡项'}
        open={isModalOpen}
        onOk={handleUpdateCheckItem}
        onCancel={handleCancel}
        okText={editingTask ? '保存' : '创建'}
        cancelText='取消'
        confirmLoading={submitLoading}
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

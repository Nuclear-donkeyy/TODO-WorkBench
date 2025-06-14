import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Form, Input, Progress, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CheckTaskCard from '../../components/CheckTaskCard';
import './index.less';
import {
  AddCheckInTaskParam,
  CheckInTask,
  CheckInTaskParam,
  DeleteCheckInTaskParam,
  ResetCheckInTaskParam,
  UpdateCheckInTaskParam,
} from '@/renderer/api/CheckIn/type';
import API from '@/renderer/api';

interface TaskFormData {
  title: string;
  description?: string;
}

export default function CheckPage(): JSX.Element {
  const [tasks, setTasks] = useState<CheckInTask[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CheckInTask | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCheckInTasks();
  }, []);

  //获取所有打卡项数据
  const fetchCheckInTasks = async (): Promise<void> => {
    setIsLoading(true);
    const response = await API.checkIn.getAllCheckIn();
    if (response.success && response.data) {
      setTasks(response.data);
      setTodayTotal(response.data.length);
      setTodayCompleted(response.data.filter(task => task.isCheckedIn).length);
    }
    setIsLoading(false);
  };

  //删除特定打卡项数据
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    const param: DeleteCheckInTaskParam = {
      id: taskId,
    };
    const response = await API.checkIn.deleteCheckInTask(param);
    if (response.success) {
      fetchCheckInTasks();
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  };

  //打卡
  const handleCheckIn = async (taskId: string): Promise<void> => {
    const param: CheckInTaskParam = {
      id: taskId,
    };
    const response = await API.checkIn.checkInTask(param);
    if (response.success) {
      //视图数据更新
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId && !task.isCheckedIn) {
            message.success(`${task.title} 打卡成功！`);
            return {
              ...task,
              isCheckedIn: true,
              checkedInAt: new Date().toLocaleString(),
              streak: task.streak + 1,
            };
          }
          return task;
        })
      );
      setTodayCompleted(prevTodayCompleted => prevTodayCompleted + 1);
    }
  };

  //重置打卡
  const handleResetCheckIn = async (taskId: string): Promise<void> => {
    const param: ResetCheckInTaskParam = {
      id: taskId,
    };
    const response = await API.checkIn.resetCheckInTask(param);
    if (response.success) {
      //视图数据更新
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId && task.isCheckedIn) {
            message.success(`${task.title} 打卡状态已重置`);
            return {
              ...task,
              isCheckedIn: false,
            };
          }
          return task;
        })
      );
    }
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

  const handleUpdateOrAddCheckItem = async (): Promise<void> => {
    setSubmitLoading(true);
    try {
      const values: TaskFormData = await form.validateFields();
      if (editingTask) {
        //更新
        const param: UpdateCheckInTaskParam = {
          id: editingTask.id,
          title: values.title,
          description: values.description || ' ',
        };
        const response = await API.checkIn.updateCheckInTaskParam(param);
        if (response.success) {
          fetchCheckInTasks();
          message.success('打卡项更新成功！');
        } else {
          message.error('打卡项信息更新失败');
        }
      } else {
        const param: AddCheckInTaskParam = {
          id: Date.now().toString(),
          title: values.title,
          description: values.description || '',
          isCheckIn: false,
          streak: 0,
        };
        const response = await API.checkIn.addCheckInTaskParam(param);
        if (response.success) {
          fetchCheckInTasks();
          message.success('新建打卡项成功！');
        } else {
          message.error('新建打卡项失败');
        }
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

      {isLoading ? (
        <Spin />
      ) : (
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
      )}

      {/* 新增/编辑打卡项弹窗 */}
      <Modal
        title={editingTask ? '编辑打卡项' : '新增打卡项'}
        open={isModalOpen}
        onOk={handleUpdateOrAddCheckItem}
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

import { useState, useEffect, useRef } from 'react';
import { Button, Input, Modal, message } from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import {
  addNewPlanTaskParam,
  DeletePlanTaskParam,
  PlanTask,
} from '@/renderer/api/PlanTask/type';
import PlanTaskCard from '@/renderer/components/PlanTaskCard';
import API from '@/renderer/api';

export default function PlanningPage(): JSX.Element {
  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const inputRef = useRef<InputRef>(null);

  const fetchPlanTask = async (): Promise<void> => {
    const response = await API.planTask.getAllPlanTask();
    if (response.success && response.data) {
      setTasks(response.data);
    }
  };
  useEffect(() => {
    fetchPlanTask();
  }, []);

  // 创建新任务
  const handleCreateTask = async (): Promise<void> => {
    const inputValue = inputRef.current?.input?.value;
    if (!inputValue || !inputValue.trim()) {
      message.error('请输入任务标题');
      return;
    }

    const param: addNewPlanTaskParam = {
      id: Date.now().toString(),
      title: inputValue.trim(),
      nodes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await API.planTask.addNewPlanTask(param);
    if (response.success) {
      fetchPlanTask();
      setIsModalVisible(false);
      message.success('任务创建成功');
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    const param: DeletePlanTaskParam = {
      taskId,
    };
    const response = await API.planTask.deletePlanTask(param);
    if (response.success) {
      fetchPlanTask();
      message.success('任务删除成功');
    } else {
      message.error('任务删除失败: ' + response.message);
    }
  };

  // 展开/折叠任务详情
  const toggleTaskExpansion = (taskId: string): void => {
    setExpandedTask(prev => (prev === taskId ? null : taskId));
  };

  return (
    <div className='planning-page'>
      <div className='page-header'>
        <h1>计划</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          新建任务
        </Button>
      </div>

      <div className='tasks-container'>
        {tasks.map(task => (
          <PlanTaskCard
            key={task.id}
            task={task}
            isExpanded={expandedTask === task.id}
            onToggleExpansion={toggleTaskExpansion}
            onDeleteTask={handleDeleteTask}
            fetchTasks={fetchPlanTask}
          />
        ))}
      </div>

      <Modal
        title='创建新任务'
        open={isModalVisible}
        onOk={handleCreateTask}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        okText='创建'
        cancelText='取消'
      >
        <Input
          ref={inputRef}
          placeholder='请输入任务标题'
          onPressEnter={handleCreateTask}
        />
      </Modal>
    </div>
  );
}

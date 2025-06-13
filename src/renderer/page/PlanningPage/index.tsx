import { useState, useEffect } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import { PlanTask, TaskNode } from '@/renderer/api/PlanTask/type';
import PlanTaskCard from '@/renderer/components/PlanTaskCard';
import API from '@/renderer/api';

export default function PlanningPage(): JSX.Element {
  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const fetchPlanTask = async (): Promise<void> => {
    const response = await API.planTask.getAllPlanTask();
    if (response.success && response.data) {
      setTasks(response.data);
    }
  };

  // 初始化示例数据
  useEffect(() => {
    fetchPlanTask();
  }, []);

  // 计算任务进度
  const calculateProgress = (
    nodes: TaskNode[]
  ): { completed: number; total: number; percentage: number } => {
    const completed = nodes.filter(node => node.completed).length;
    const total = nodes.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  // 创建新任务
  const handleCreateTask = (): void => {
    if (!newTaskTitle.trim()) {
      message.error('请输入任务标题');
      return;
    }

    const newTask: PlanTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      nodes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setIsModalVisible(false);
    message.success('任务创建成功');
  };

  // 删除任务
  const handleDeleteTask = (taskId: string): void => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    message.success('任务删除成功');
  };

  // 展开/折叠任务详情
  const toggleTaskExpansion = (taskId: string): void => {
    setExpandedTask(prev => (prev === taskId ? null : taskId));
  };

  // 添加任务节点
  const handleAddNode = (taskId: string, title: string): void => {
    if (!title.trim()) {
      message.error('请输入节点标题');
      return;
    }

    const newNode: TaskNode = {
      id: `${taskId}-${Date.now()}`,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              nodes: [...task.nodes, newNode],
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );

    message.success('节点添加成功');
  };

  // 切换节点完成状态
  const toggleNodeComplete = (taskId: string, nodeId: string): void => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              nodes: task.nodes.map(node =>
                node.id === nodeId
                  ? {
                      ...node,
                      completed: !node.completed,
                      status: !node.completed ? 'completed' : 'pending',
                    }
                  : node
              ),
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  // 删除节点
  const handleDeleteNode = (taskId: string, nodeId: string): void => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              nodes: task.nodes.filter(node => node.id !== nodeId),
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    message.success('节点删除成功');
  };

  return (
    <div className='planning-page'>
      <div className='page-header'>
        <h1>长期计划</h1>
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
            onAddNode={handleAddNode}
            onToggleNodeComplete={toggleNodeComplete}
            onDeleteNode={handleDeleteNode}
            calculateProgress={calculateProgress}
          />
        ))}
      </div>

      <Modal
        title='创建新任务'
        open={isModalVisible}
        onOk={handleCreateTask}
        onCancel={() => {
          setIsModalVisible(false);
          setNewTaskTitle('');
        }}
        okText='创建'
        cancelText='取消'
      >
        <Input
          placeholder='请输入任务标题'
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          onPressEnter={handleCreateTask}
        />
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button, Input, Modal, Progress, message } from 'antd';
import {
  PlusOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { TaskNode } from '@/renderer/components/TaskNode';
import TaskNodesSection from '@/renderer/components/TaskNodesSection';
import './index.less';

// 计划任务接口
interface PlanTask {
  id: string;
  title: string;
  description?: string;
  nodes: TaskNode[];
  createdAt: string;
  updatedAt: string;
}

export default function PlanningPage(): JSX.Element {
  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // 初始化示例数据
  useEffect(() => {
    const sampleTasks: PlanTask[] = [
      {
        id: '1',
        title: '原理学习与源码解读',
        description: '当前阶段: React',
        nodes: [
          {
            id: '1-1',
            title: 'React 基础概念学习',
            completed: true,
            createdAt: '2024-01-01',
            status: 'completed',
          },
          {
            id: '1-2',
            title: 'React Hooks 深入理解',
            completed: true,
            createdAt: '2024-01-02',
            status: 'completed',
          },
          {
            id: '1-3',
            title: 'React 源码分析',
            completed: false,
            createdAt: '2024-01-03',
            status: 'in-progress',
          },
          {
            id: '1-4',
            title: 'React 性能优化',
            completed: false,
            createdAt: '2024-01-04',
            status: 'pending',
          },
          {
            id: '1-5',
            title: 'React 18 新特性',
            completed: false,
            createdAt: '2024-01-05',
            status: 'pending',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-03',
      },
      {
        id: '2',
        title: 'NPIMS',
        description: '当前阶段: 暂无进行中',
        nodes: [
          {
            id: '2-1',
            title: '需求分析',
            completed: true,
            createdAt: '2024-01-01',
            status: 'completed',
          },
          {
            id: '2-2',
            title: '系统设计',
            completed: true,
            createdAt: '2024-01-02',
            status: 'completed',
          },
          {
            id: '2-3',
            title: '前端开发',
            completed: true,
            createdAt: '2024-01-03',
            status: 'completed',
          },
          {
            id: '2-4',
            title: '后端开发',
            completed: true,
            createdAt: '2024-01-04',
            status: 'completed',
          },
          {
            id: '2-5',
            title: '测试部署',
            completed: true,
            createdAt: '2024-01-05',
            status: 'completed',
          },
          {
            id: '2-6',
            title: '性能优化',
            completed: true,
            createdAt: '2024-01-06',
            status: 'completed',
          },
          {
            id: '2-7',
            title: '文档编写',
            completed: false,
            createdAt: '2024-01-07',
            status: 'in-progress',
          },
          {
            id: '2-8',
            title: '维护更新',
            completed: false,
            createdAt: '2024-01-08',
            status: 'pending',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-07',
      },
      {
        id: '3',
        title: '一些在等的时间点',
        description: '当前阶段: 5.23 史前星球 名...',
        nodes: [
          {
            id: '3-1',
            title: '准备阶段规划',
            completed: true,
            createdAt: '2024-01-01',
            status: 'completed',
          },
          {
            id: '3-2',
            title: '时间点确认',
            completed: true,
            createdAt: '2024-01-02',
            status: 'completed',
          },
          {
            id: '3-3',
            title: '资源准备',
            completed: false,
            createdAt: '2024-01-03',
            status: 'in-progress',
          },
          {
            id: '3-4',
            title: '执行计划',
            completed: false,
            createdAt: '2024-01-04',
            status: 'pending',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-03',
      },
      {
        id: '4',
        title: '555',
        description: '当前阶段: 暂无进行中',
        nodes: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];
    setTasks(sampleTasks);
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
        <h1>计划组织</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          新建任务
        </Button>
      </div>

      <div className='tasks-container'>
        {tasks.map(task => {
          const progress = calculateProgress(task.nodes);
          const isExpanded = expandedTask === task.id;

          return (
            <div
              key={task.id}
              className={`task-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className='task-header'
                onClick={() => toggleTaskExpansion(task.id)}
              >
                <div className='task-info'>
                  <h3 className='task-title'>{task.title}</h3>
                  {task.description && (
                    <p className='task-description'>{task.description}</p>
                  )}
                </div>
                <div className='task-progress'>
                  <span className='progress-text'>
                    进度 {progress.completed}/{progress.total}
                  </span>
                  <div className='action-buttons'>
                    <Button
                      type='text'
                      icon={<EllipsisOutlined />}
                      size='small'
                    />
                    <Button
                      type='text'
                      icon={<DeleteOutlined />}
                      size='small'
                      danger
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className='task-details'>
                  <div className='progress-bar-container'>
                    <Progress
                      percent={progress.percentage}
                      strokeColor='var(--accent-color)'
                      trailColor='var(--surface-tertiary)'
                    />
                  </div>

                  <TaskNodesSection
                    nodes={task.nodes}
                    onAddNode={(title: string) => handleAddNode(task.id, title)}
                    onToggleNodeComplete={(nodeId: string) =>
                      toggleNodeComplete(task.id, nodeId)
                    }
                    onDeleteNode={(nodeId: string) =>
                      handleDeleteNode(task.id, nodeId)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
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

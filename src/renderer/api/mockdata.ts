import { TodoItem } from '@/api/TODOList/types';
import { Note } from '@/api/Note/types';
import { CheckInTask } from './CheckIn/type';
import { PlanTask } from './PlanTask/type';
// 模拟数据存储

/**
 * 代办项数据
 */
export const mockTodos: TodoItem[] = [
  {
    id: '1',
    content: '完成项目文档',
    color: '#667eea',
    description: '编写技术文档和用户手册',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: '代码审查',
    color: '#00d4aa',
    description: '审查团队成员提交的代码',
    startDate: '2024-01-16',
    endDate: '2024-01-17',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    content: '准备演示',
    color: '#ef4444',
    description: '为客户演示准备材料',
    startDate: '2024-01-18',
    endDate: '2025-06-22',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    content: '哈牛魔',
    color: '#667eea',
    description: '编写技术文档和用户手册',
    startDate: '2024-01-15',
    endDate: '2025-06-22',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    content:
      '摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆摸南北绿豆',
    color: '#00d4aa',
    description: '审查团队成员提交的代码',
    startDate: '2024-01-16',
    endDate: '2025-06-23',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    content: '哈基米',
    color: '#ef4444',
    description: '为客户演示准备材料',
    startDate: '2024-01-18',
    endDate: '2025-06-22',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * 笔记本数据
 */
export const mockNotes: Note[] = [
  {
    id: '1',
    title: '我的第一篇笔记',
    content:
      '这是一篇示例笔记，你可以在这里记录你的想法和灵感。\n\n支持多行编辑，可以记录详细的内容。',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: '今日待办',
    content:
      '1. 完成项目文档\n2. 准备明天的会议\n3. 回复重要邮件\n4. 整理桌面文件',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16',
  },
];

/**
 * 打卡数据
 */
export const mockCheckInTask: CheckInTask[] = [
  {
    id: '1',
    title: '晚上节食',
    description: '健康、节制，比前一天的自己更好',
    isCheckedIn: false,
    streak: 7,
  },
  {
    id: '2',
    title: '好好睡觉',
    description: 'Go healthy, just sleep',
    isCheckedIn: true,
    checkedInAt: new Date().toLocaleString(),
    streak: 12,
  },
  {
    id: '3',
    title: '技术学习',
    description: '学习技术，争取35不改咯',
    isCheckedIn: false,
    streak: 3,
  },
  {
    id: '4',
    title: '步数10000+',
    description: '保持活动',
    isCheckedIn: false,
    streak: 5,
  },
  {
    id: '5',
    title: '学习强国',
    description: '每日学习任务',
    isCheckedIn: false,
    streak: 15,
  },
  {
    id: '6',
    title: '体重记录',
    description: '记录体重变化',
    isCheckedIn: false,
    streak: 2,
  },
];

/**
 * 计划数据
 */
export const mockSampleTasks: PlanTask[] = [
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

import { TodoItem } from '@/api/TODOList/types';
import { Note } from '@/api/Note/types';
import { CheckInTask } from './CheckIn/type';
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

export const mockCheckInTask: CheckInTask[] = [
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
];

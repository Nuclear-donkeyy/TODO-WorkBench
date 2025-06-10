import React, { useState, useEffect } from 'react';
import { Button, message, Badge, Progress } from 'antd';
import './index.less';

interface CheckInTask {
  id: string;
  title: string;
  description: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  streak: number; // 连续打卡天数
  progress?: number; // 进度百分比
  category?: 'health' | 'study' | 'work' | 'fitness' | 'other';
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
      category: 'health',
    },
    {
      id: '2',
      title: '好好睡觉',
      description: 'Go healthy, just sleep',
      isCheckedIn: true,
      checkedInAt: new Date().toLocaleString(),
      streak: 12,
      progress: 100,
      category: 'health',
    },
    {
      id: '3',
      title: '技术学习',
      description: '学习技术，争取35不改咯',
      isCheckedIn: false,
      streak: 3,
      progress: 25,
      category: 'study',
    },
    {
      id: '4',
      title: '步数10000+',
      description: '保持活动',
      isCheckedIn: false,
      streak: 5,
      progress: 45,
      category: 'fitness',
    },
    {
      id: '5',
      title: '学习强国',
      description: '',
      isCheckedIn: false,
      streak: 15,
      progress: 80,
      category: 'study',
    },
    {
      id: '6',
      title: '体重记录',
      description: '肥胖来自于手机，…',
      isCheckedIn: false,
      streak: 2,
      progress: 15,
      category: 'health',
    },
  ]);

  const [todayTotal, setTodayTotal] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);

  useEffect(() => {
    setTodayTotal(tasks.length);
    setTodayCompleted(tasks.filter(task => task.isCheckedIn).length);
  }, [tasks]);

  const handleCheckIn = (taskId: string) => {
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

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'health':
        return 'var(--accent-color)';
      case 'study':
        return 'var(--primary-color)';
      case 'work':
        return 'var(--secondary-color)';
      case 'fitness':
        return 'var(--warning-color)';
      default:
        return 'var(--info-color)';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'health':
        return '🏥';
      case 'study':
        return '📚';
      case 'work':
        return '💼';
      case 'fitness':
        return '🏃';
      default:
        return '📋';
    }
  };

  return (
    <div className='check-page-container'>
      <div className='check-header'>
        <div className='header-content'>
          <h1 className='page-title'>打卡中心</h1>
          <div className='today-stats'>
            <div className='stats-item'>
              <span className='stats-label'>今日完成</span>
              <span className='stats-value'>
                {todayCompleted}/{todayTotal}
              </span>
            </div>
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
        <Button type='primary' size='large' className='add-task-btn'>
          新建
        </Button>
      </div>

      <div className='tasks-grid'>
        {tasks.map(task => (
          <div
            key={task.id}
            className={`task-card ${task.isCheckedIn ? 'checked-in' : ''}`}
          >
            <div className='task-header'>
              <div className='task-category'>
                <span className='category-icon'>
                  {getCategoryIcon(task.category)}
                </span>
                <Badge
                  count={task.streak}
                  style={{
                    backgroundColor: getCategoryColor(task.category),
                    color: 'white',
                    fontSize: '12px',
                  }}
                  title={`连续${task.streak}天`}
                />
              </div>
              {task.isCheckedIn && (
                <div className='check-status'>
                  <span className='check-icon'>✓</span>
                </div>
              )}
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
                    strokeColor={getCategoryColor(task.category)}
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

            <div className='task-actions'>
              {task.isCheckedIn ? (
                <Button className='checked-btn' disabled icon={<span>✓</span>}>
                  已打卡
                </Button>
              ) : (
                <Button
                  type='primary'
                  className='check-btn'
                  onClick={() => handleCheckIn(task.id)}
                  style={{ backgroundColor: getCategoryColor(task.category) }}
                >
                  打卡
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  AimOutlined,
  FireOutlined,
} from '@ant-design/icons';
import StatCard from '../../components/StatCard';
import ProgressRing from '../../components/ProgressRing';
import CompletionChart from '../../components/CompletionChart';
import DashboardGrid, {
  DashboardGridItem,
} from '../../components/DashboardGrid';
import DashboardControlPanel, {
  DashboardWidget,
} from '../../components/DashboardControlPanel';
import { API } from '../../api';
import { TodoItem } from '../../api/TODOList/types';
import dayjs from 'dayjs';
import './index.less';

export default function DashboardPage(): JSX.Element {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'total-plans',
      name: '总计划数',
      visible: true,
      category: '基础统计',
      description: '显示所有计划的总数量',
    },
    {
      id: 'total-checkins',
      name: '总打卡次数',
      visible: true,
      category: '基础统计',
      description: '显示累计打卡次数',
    },
    {
      id: 'pending-tasks',
      name: '未完成任务数',
      visible: true,
      category: '任务状态',
      description: '显示当前未完成的任务数量',
    },
    {
      id: 'today-deadline',
      name: '今日截止任务数',
      visible: true,
      category: '任务状态',
      description: '显示今天截止的任务数量',
    },
    {
      id: 'completed-tasks',
      name: '累计完成任务数',
      visible: true,
      category: '成就统计',
      description: '显示已完成的任务总数',
    },
    {
      id: 'completion-progress',
      name: '任务完成进度',
      visible: true,
      category: '图表展示',
      description: '环形图显示整体完成进度',
    },
    {
      id: 'completion-chart',
      name: '任务完成比',
      visible: true,
      category: '图表展示',
      description: '饼图显示完成与未完成比例',
    },
  ]);

  // 获取TODO数据
  const fetchTodos = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await API.todo.getTodoList({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setTodos(response.data.items);
      }
    } catch (error) {
      console.error('获取TODO数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 计算统计数据
  const stats = useMemo(() => {
    const completedTasks = todos.filter(todo => todo.completed);
    const pendingTasks = todos.filter(todo => !todo.completed);
    const today = dayjs().format('YYYY-MM-DD');
    const todayDeadlineTasks = todos.filter(
      todo =>
        !todo.completed &&
        todo.endDate &&
        dayjs(todo.endDate).format('YYYY-MM-DD') === today
    );

    const completionRate =
      todos.length > 0
        ? Math.round((completedTasks.length / todos.length) * 100)
        : 0;

    return {
      totalPlans: todos.length,
      totalCheckins: Math.floor(Math.random() * 150) + 50, // 模拟打卡数据
      pendingTasks: pendingTasks.length,
      todayDeadline: todayDeadlineTasks.length,
      completedTasks: completedTasks.length,
      completionRate,
    };
  }, [todos]);

  // 生成网格项目
  const generateGridItems = (): DashboardGridItem[] => {
    const items: DashboardGridItem[] = [];

    // 只包含可见的widgets
    const visibleWidgets = widgets.filter(w => w.visible);

    visibleWidgets.forEach((widget, index) => {
      let component: React.ReactNode;
      let w = 3,
        h = 2; // 默认大小

      switch (widget.id) {
        case 'total-plans':
          component = (
            <StatCard
              title='总计划数'
              value={stats.totalPlans}
              icon={<AimOutlined />}
              color='var(--color-primary)'
            />
          );
          break;

        case 'total-checkins':
          component = (
            <StatCard
              title='总打卡次数'
              value={stats.totalCheckins}
              icon={<FireOutlined />}
              color='var(--color-warning)'
              trend={{ value: 12, isUp: true }}
            />
          );
          break;

        case 'pending-tasks':
          component = (
            <StatCard
              title='未完成任务数'
              value={stats.pendingTasks}
              icon={<ClockCircleOutlined />}
              color='var(--color-error)'
            />
          );
          break;

        case 'today-deadline':
          component = (
            <StatCard
              title='今日截止任务数'
              value={stats.todayDeadline}
              icon={<CalendarOutlined />}
              color='var(--color-info)'
            />
          );
          break;

        case 'completed-tasks':
          component = (
            <StatCard
              title='累计完成任务数'
              value={stats.completedTasks}
              icon={<CheckCircleOutlined />}
              color='var(--color-success)'
              trend={{ value: 8, isUp: true }}
            />
          );
          break;

        case 'completion-progress':
          component = (
            <ProgressRing
              title='任务完成进度'
              percentage={stats.completionRate}
              total={stats.totalPlans}
              completed={stats.completedTasks}
              color='var(--color-accent)'
              size='md'
            />
          );
          h = 3; // 进度环需要更多高度
          break;

        case 'completion-chart':
          component = (
            <CompletionChart
              title='任务完成比'
              completedTasks={stats.completedTasks}
              totalTasks={stats.totalPlans}
            />
          );
          w = 4;
          h = 4; // 图表需要更多空间
          break;

        default:
          component = <div>未知组件</div>;
      }

      // 计算位置（更灵活的布局）
      const col = (index % 4) * 4;
      const row = Math.floor(index / 4) * 3;

      items.push({
        i: widget.id,
        x: col,
        y: row,
        w,
        h,
        component,
        minW: Math.max(2, w - 1),
        minH: Math.max(1, h - 1),
        maxW: w + 2,
        maxH: h + 2,
      });
    });

    return items;
  };

  const handleWidgetToggle = (widgetId: string, visible: boolean): void => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId ? { ...widget, visible } : widget
      )
    );
  };

  const handleResetLayout = (): void => {
    // 重置所有组件为可见状态
    setWidgets(prev => prev.map(widget => ({ ...widget, visible: true })));
  };

  const gridItems = generateGridItems();

  return (
    <div className='dashboard-page'>
      <div className='dashboard-page__content'>
        {loading ? (
          <div className='dashboard-page__loading'>
            <div className='dashboard-page__loading-spinner'></div>
            <p>正在加载仪表板数据...</p>
          </div>
        ) : (
          <DashboardGrid
            items={gridItems}
            rowHeight={80}
            margin={[12, 12]}
            containerPadding={[16, 16]}
            isDraggable={true}
            isResizable={false}
          />
        )}
      </div>

      <DashboardControlPanel
        widgets={widgets}
        onWidgetToggle={handleWidgetToggle}
        onResetLayout={handleResetLayout}
        position='top-right'
      />
    </div>
  );
}

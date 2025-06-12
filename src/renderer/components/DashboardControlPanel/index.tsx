import React, { useState } from 'react';
import { Button, Drawer, Switch, Divider } from 'antd';
import {
  SettingOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import './index.less';

export interface DashboardWidget {
  id: string;
  name: string;
  description?: string;
  visible: boolean;
  category?: string;
}

export interface DashboardControlPanelProps {
  widgets: DashboardWidget[];
  onWidgetToggle: (widgetId: string, visible: boolean) => void;
  onResetLayout?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function DashboardControlPanel(
  props: DashboardControlPanelProps
): JSX.Element {
  const {
    widgets,
    onWidgetToggle,
    onResetLayout,
    position = 'top-right',
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleWidgetToggle = (widgetId: string, checked: boolean) => {
    onWidgetToggle(widgetId, checked);
  };

  const handleResetLayout = () => {
    onResetLayout?.();
    setIsOpen(false);
  };

  // 按类别分组widgets
  const groupedWidgets = widgets.reduce(
    (groups, widget) => {
      const category = widget.category || '其他';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(widget);
      return groups;
    },
    {} as Record<string, DashboardWidget[]>
  );

  const visibleCount = widgets.filter(w => w.visible).length;
  const totalCount = widgets.length;

  return (
    <>
      <div
        className={`dashboard-control-panel__trigger dashboard-control-panel__trigger--${position}`}
      >
        <Button
          type='primary'
          shape='circle'
          icon={<SettingOutlined />}
          onClick={handleTogglePanel}
          className='dashboard-control-panel__trigger-btn'
          title='仪表板设置'
        />
        {visibleCount < totalCount && (
          <div className='dashboard-control-panel__badge'>
            {visibleCount}/{totalCount}
          </div>
        )}
      </div>

      <Drawer
        title={
          <div className='dashboard-control-panel__header'>
            <div className='dashboard-control-panel__title'>
              <SettingOutlined />
              <span>仪表板设置</span>
            </div>
            <div className='dashboard-control-panel__subtitle'>
              显示 {visibleCount} / {totalCount} 个组件
            </div>
          </div>
        }
        placement='right'
        width={360}
        open={isOpen}
        onClose={handleTogglePanel}
        className='dashboard-control-panel__drawer'
        extra={
          <Button size='small' onClick={handleResetLayout}>
            重置布局
          </Button>
        }
      >
        <div className='dashboard-control-panel__content'>
          <div className='dashboard-control-panel__summary'>
            <div className='dashboard-control-panel__summary-item'>
              <EyeOutlined style={{ color: 'var(--color-success)' }} />
              <span>显示: {visibleCount}</span>
            </div>
            <div className='dashboard-control-panel__summary-item'>
              <EyeInvisibleOutlined
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              <span>隐藏: {totalCount - visibleCount}</span>
            </div>
          </div>

          <Divider>组件设置</Divider>

          <div className='dashboard-control-panel__widgets'>
            {Object.entries(groupedWidgets).map(
              ([category, categoryWidgets]) => (
                <div
                  key={category}
                  className='dashboard-control-panel__category'
                >
                  <h4 className='dashboard-control-panel__category-title'>
                    {category}
                  </h4>
                  <div className='dashboard-control-panel__category-widgets'>
                    {categoryWidgets.map(widget => (
                      <div
                        key={widget.id}
                        className='dashboard-control-panel__widget-item'
                      >
                        <div className='dashboard-control-panel__widget-info'>
                          <div className='dashboard-control-panel__widget-name'>
                            {widget.name}
                          </div>
                          {widget.description && (
                            <div className='dashboard-control-panel__widget-desc'>
                              {widget.description}
                            </div>
                          )}
                        </div>
                        <Switch
                          checked={widget.visible}
                          onChange={checked =>
                            handleWidgetToggle(widget.id, checked)
                          }
                          size='small'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          <Divider>快捷操作</Divider>

          <div className='dashboard-control-panel__actions'>
            <Button
              block
              onClick={() => {
                widgets.forEach(widget => {
                  if (!widget.visible) {
                    onWidgetToggle(widget.id, true);
                  }
                });
              }}
              disabled={visibleCount === totalCount}
            >
              显示全部
            </Button>

            <Button
              block
              onClick={() => {
                widgets.forEach(widget => {
                  if (widget.visible) {
                    onWidgetToggle(widget.id, false);
                  }
                });
              }}
              disabled={visibleCount === 0}
              style={{ marginTop: 8 }}
            >
              隐藏全部
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

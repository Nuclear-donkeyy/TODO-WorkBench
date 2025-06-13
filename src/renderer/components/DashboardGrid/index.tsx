import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import './index.less';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DashboardGridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: React.ReactNode;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DashboardGridProps {
  items: DashboardGridItem[];
  isDraggable?: boolean;
  isResizable?: boolean;
  margin?: [number, number];
  containerPadding?: [number, number];
  rowHeight?: number;
  breakpoints?: { lg: number; md: number; sm: number; xs: number; xxs: number };
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
}

const defaultBreakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const defaultCols = { lg: 16, md: 12, sm: 8, xs: 6, xxs: 4 };

export default function DashboardGrid(props: DashboardGridProps): JSX.Element {
  const {
    items,
    isDraggable = true,
    isResizable = false,
    margin = [16, 16],
    containerPadding = [16, 16],
    rowHeight = 120,
    breakpoints = defaultBreakpoints,
    cols = defaultCols,
  } = props;

  const [layouts, setLayouts] = useState<any>({});
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [originalPositions, setOriginalPositions] = useState<
    Map<string, Layout>
  >(new Map());
  const [affectedItems, setAffectedItems] = useState<Set<string>>(new Set());

  const handleLayoutChange = useCallback(
    (layout: Layout[], allLayouts: any) => {
      setLayouts(allLayouts);
    },
    []
  );

  const handleDragStart = useCallback(
    (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
      _element: HTMLElement
    ) => {
      setIsDragging(true);
      setDraggedItem(newItem.i);

      // 记录所有卡片的原始位置
      const positionsMap = new Map<string, Layout>();
      layout.forEach(item => {
        positionsMap.set(item.i, { ...item });
      });
      setOriginalPositions(positionsMap);
      setAffectedItems(new Set());
    },
    []
  );

  const handleDrag = useCallback(
    (
      layout: Layout[],
      _oldItem: Layout,
      _newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
      _element: HTMLElement
    ) => {
      if (!draggedItem) return;
      const draggedLayout = layout.find(item => item.i === draggedItem);
      if (!draggedLayout) return;

      const currentAffected = new Set<string>();

      // 检查是否与拖拽项发生碰撞
      layout.forEach(item => {
        if (item.i === draggedItem) return;
        if (isColliding(draggedLayout, item)) {
          currentAffected.add(item.i);
        }
      });
      // 合并当前受影响的卡片和之前受影响的卡片
      const allAffected = new Set([...affectedItems, ...currentAffected]);
      setAffectedItems(allAffected);

      const optimizedLayout = optimizeLayout(layout, allAffected);
      handleLayoutChange(optimizedLayout, {
        [getCurrentBreakpoint()]: optimizedLayout,
      });
    },
    [draggedItem, originalPositions, affectedItems, handleLayoutChange]
  );

  const handleDragStop = useCallback(
    (
      layout: Layout[],
      _oldItem: Layout,
      _newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
      _element: HTMLElement
    ) => {
      setIsDragging(false);
      setDraggedItem(null);
      setOriginalPositions(new Map());
      setAffectedItems(new Set());
      handleLayoutChange(layout, { [getCurrentBreakpoint()]: layout });
    },
    [handleLayoutChange]
  );

  const getCurrentBreakpoint = (): 'lg' | 'md' | 'sm' | 'xs' | 'xxs' => {
    const width = window.innerWidth;
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    if (width >= breakpoints.xs) return 'xs';
    return 'xxs';
  };

  // 检查两个布局项是否发生碰撞
  const isColliding = (item1: Layout, item2: Layout): boolean => {
    return !(
      item1.x + item1.w <= item2.x ||
      item2.x + item2.w <= item1.x ||
      item1.y + item1.h <= item2.y ||
      item2.y + item2.h <= item1.y
    );
  };

  // 检查位置是否被占用
  const isPositionOccupied = (
    layout: Layout[],
    x: number,
    y: number,
    w: number,
    h: number,
    excludeId?: string
  ): boolean => {
    return layout.some(item => {
      if (excludeId && item.i === excludeId) return false;
      return isColliding({ x, y, w, h } as Layout, item);
    });
  };

  // 优化布局，优先让受影响的卡片回到原位
  const optimizeLayout = (
    currentLayout: Layout[],
    affected: Set<string>
  ): Layout[] => {
    const newLayout = [...currentLayout];
    const processed: string[] = [];
    // 处理受影响的卡片
    affected.forEach(itemId => {
      const currentItem = newLayout.find(item => item.i === itemId);
      const originalItem = originalPositions.get(itemId);

      if (!currentItem || !originalItem) return;

      // 检查原位置是否可用（不与拖拽项和其他固定项冲突）
      const canReturnToOriginal = !isPositionOccupied(
        newLayout.filter(item => item.i !== itemId),
        originalItem.x,
        originalItem.y,
        originalItem.w,
        originalItem.h,
        itemId
      );

      if (canReturnToOriginal) {
        // 可以回到原位
        currentItem.x = originalItem.x;
        currentItem.y = originalItem.y;
        processed.push(itemId);
      } else {
        // 不能回到原位，寻找最近的可用位置
        const newPosition = findNearestAvailablePosition(
          newLayout,
          originalItem,
          itemId
        );
        if (newPosition) {
          currentItem.x = newPosition.x;
          currentItem.y = newPosition.y;
        }
      }
    });
    processed.forEach(itemId => {
      affected.delete(itemId);
    });
    return newLayout;
  };

  // 寻找最近的可用位置
  const findNearestAvailablePosition = (
    layout: Layout[],
    targetItem: Layout,
    excludeId: string
  ): { x: number; y: number } | null => {
    const maxCols: number = cols[getCurrentBreakpoint()] || 16;
    const maxSearchDistance = 10;

    // 从原位置开始，螺旋式搜索最近的可用位置
    for (let distance = 1; distance <= maxSearchDistance; distance++) {
      for (let dx = -distance; dx <= distance; dx++) {
        for (let dy = -distance; dy <= distance; dy++) {
          if (Math.abs(dx) === distance || Math.abs(dy) === distance) {
            const newX = Math.max(
              0,
              Math.min(targetItem.x + dx, maxCols - targetItem.w)
            );
            const newY = Math.max(0, targetItem.y + dy);

            if (
              !isPositionOccupied(
                layout,
                newX,
                newY,
                targetItem.w,
                targetItem.h,
                excludeId
              )
            ) {
              return { x: newX, y: newY };
            }
          }
        }
      }
    }

    return null;
  };

  // 从items生成layouts
  const generateLayouts = () => {
    const layoutsObject: any = {};

    Object.keys(breakpoints).forEach(breakpoint => {
      layoutsObject[breakpoint] = items.map(item => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH,
      }));
    });

    return layoutsObject;
  };

  return (
    <div className='dashboard-grid'>
      <ResponsiveGridLayout
        className='layout'
        layouts={Object.keys(layouts).length > 0 ? layouts : generateLayouts()}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={rowHeight}
        margin={margin}
        containerPadding={containerPadding}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        draggableHandle='.dashboard-grid__drag-handle'
        useCSSTransforms={false}
        compactType={null}
        preventCollision={true}
        allowOverlap={true}
        isBounded={false}
        transformScale={1}
        droppingItem={undefined}
      >
        {items.map(item => (
          <div
            key={item.i}
            className={`dashboard-grid__item ${
              draggedItem === item.i ? 'dashboard-grid__item--dragging' : ''
            } ${
              isDragging && draggedItem !== item.i && affectedItems.has(item.i)
                ? 'dashboard-grid__item--avoiding'
                : ''
            }`}
          >
            <div className='dashboard-grid__drag-handle'>
              <div className='dashboard-grid__drag-dots'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className='dashboard-grid__content'>{item.component}</div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

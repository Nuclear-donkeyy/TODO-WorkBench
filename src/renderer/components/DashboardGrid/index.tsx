import React, { useState, useCallback, useEffect } from 'react';
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

  // 从items生成layouts
  const generateLayouts = useCallback(() => {
    const layoutsObject: any = {};

    Object.keys(breakpoints).forEach(breakpoint => {
      const maxCols = cols[breakpoint as keyof typeof cols] || 4;
      const adjustedItems: Layout[] = [];

      // 先按原始 y 坐标排序，保持卡片的相对顺序
      const sortedItems = [...items].sort((a, b) => a.y - b.y || a.x - b.x);

      // 对每个断点重新计算布局
      sortedItems.forEach(item => {
        const adjustedW = Math.min(item.w, maxCols); // 确保宽度不超过最大列数

        // 尝试保持原始位置，但需要调整以适应新的列数
        let targetX = Math.min(item.x, maxCols - adjustedW);
        if (targetX < 0) targetX = 0;

        // 查找最佳位置
        const bestPosition = findBestPosition(
          adjustedItems,
          {
            w: adjustedW,
            h: item.h,
            preferredX: targetX,
            preferredY: item.y,
          },
          maxCols
        );

        adjustedItems.push({
          i: item.i,
          x: bestPosition.x,
          y: bestPosition.y,
          w: adjustedW,
          h: item.h,
          minW: item.minW ? Math.min(item.minW, maxCols) : undefined,
          minH: item.minH,
          maxW: item.maxW ? Math.min(item.maxW, maxCols) : undefined,
          maxH: item.maxH,
        });
      });

      layoutsObject[breakpoint] = adjustedItems;
    });

    return layoutsObject;
  }, [items, breakpoints, cols]);

  // 监听窗口大小变化，重新生成布局
  useEffect(() => {
    const handleResize = () => {
      const newLayouts = generateLayouts();
      setLayouts(newLayouts);
    };

    // 初始化布局
    handleResize();

    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateLayouts]); // 当 generateLayouts 变化时重新生成布局

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

  // Helper function to check collision between two layout items
  const isCollidingItems = useCallback(
    (
      item1: { x: number; y: number; w: number; h: number },
      item2: Layout
    ): boolean => {
      return !(
        item1.x + item1.w <= item2.x ||
        item2.x + item2.w <= item1.x ||
        item1.y + item1.h <= item2.y ||
        item2.y + item2.h <= item1.y
      );
    },
    []
  );

  // 检查位置是否被占用（专门用于Layout数组）
  const isPositionOccupiedInItems = useCallback(
    (items: Layout[], x: number, y: number, w: number, h: number): boolean => {
      return items.some(item => {
        return isCollidingItems({ x, y, w, h }, item);
      });
    },
    [isCollidingItems]
  );

  // 查找最佳位置的算法
  const findBestPosition = useCallback(
    (
      existingItems: Layout[],
      itemToPlace: {
        w: number;
        h: number;
        preferredX: number;
        preferredY: number;
      },
      maxCols: number
    ): { x: number; y: number } => {
      const { w, h, preferredX, preferredY } = itemToPlace;

      // 首先尝试首选位置
      if (
        !isPositionOccupiedInItems(existingItems, preferredX, preferredY, w, h)
      ) {
        return { x: preferredX, y: preferredY };
      }

      // 如果首选位置不可用，寻找最近的可用位置
      // 优先尝试同一行的其他位置
      for (let x = 0; x <= maxCols - w; x++) {
        if (!isPositionOccupiedInItems(existingItems, x, preferredY, w, h)) {
          return { x, y: preferredY };
        }
      }

      // 如果同一行没有空间，寻找下面的行
      for (let y = preferredY + 1; y < preferredY + 20; y++) {
        // 限制搜索范围
        for (let x = 0; x <= maxCols - w; x++) {
          if (!isPositionOccupiedInItems(existingItems, x, y, w, h)) {
            return { x, y };
          }
        }
      }

      // 如果还是找不到，尝试上面的行
      for (let y = Math.max(0, preferredY - 1); y >= 0; y--) {
        for (let x = 0; x <= maxCols - w; x++) {
          if (!isPositionOccupiedInItems(existingItems, x, y, w, h)) {
            return { x, y };
          }
        }
      }

      // 最后的兜底方案：找到最下方的空位置
      let maxY = 0;
      existingItems.forEach(item => {
        maxY = Math.max(maxY, item.y + item.h);
      });

      return { x: 0, y: maxY };
    },
    [isPositionOccupiedInItems]
  );

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

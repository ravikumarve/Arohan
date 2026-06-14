// Virtual List Component for large datasets
// Uses virtual scrolling for optimal performance

import { memo, forwardRef } from 'react';
import { useVirtualScroll } from '@/hooks/use-optimization';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

function VirtualListInner<T>(
  { items, itemHeight, containerHeight, renderItem, overscan = 3, className = '' }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { visibleItems, totalHeight, handleScroll, scrollRef } = useVirtualScroll(items, {
    itemHeight,
    containerHeight,
    overscan,
  });

  return (
    <div
      ref={(el) => {
        if (el) {
          scrollRef.current = el;
        }
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, offset }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offset,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export const VirtualList = memo(forwardRef(VirtualListInner)) as <T>(
  props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

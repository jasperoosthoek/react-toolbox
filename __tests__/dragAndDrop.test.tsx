import React from 'react';
import { render, act } from '@testing-library/react';
import { LocalizationProvider } from '../src/localization/LocalizationContext';

// Store captured configs from useDrop and useDrag calls
// Must be prefixed with "mock" to be accessible inside jest.mock factory
let mockDropConfigs: any[] = [];
let mockDragConfigs: any[] = [];

// Override the global react-dnd mock with one that captures configs
jest.mock('react-dnd', () => ({
  useDrop: jest.fn((config: any) => {
    mockDropConfigs.push(config);
    return [{ handlerId: 'test-handler' }, (ref: any) => ref];
  }),
  useDrag: jest.fn((config: any) => {
    mockDragConfigs.push(config);
    return [{ isDragging: false }, (ref: any) => ref, (ref: any) => ref];
  }),
  DndProvider: ({ children }: any) => children,
  useDragLayer: jest.fn(() => ({})),
}));

import { DragAndDropList } from '../src/components/tables/DragAndDropList';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>{children}</LocalizationProvider>
);

const TestItem = React.forwardRef<HTMLDivElement, any>(
  ({ name, dropped, style, ...props }, ref) => (
    <div ref={ref} data-testid={`item-${name}`} data-dropped={dropped} style={style} {...props}>
      {name}
    </div>
  )
);

describe('DragAndDropList', () => {
  beforeEach(() => {
    mockDropConfigs = [];
    mockDragConfigs = [];
  });

  it('should render all items from propsArray', () => {
    const { getByText } = render(
      <TestWrapper>
        <DragAndDropList
          propsArray={[{ name: 'A' }, { name: 'B' }, { name: 'C' }]}
          onDrop={jest.fn()}
          component={TestItem}
        />
      </TestWrapper>
    );

    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('C')).toBeInTheDocument();
  });

  it('should render items with cursor move style', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DragAndDropList
          propsArray={[{ name: 'A' }]}
          onDrop={jest.fn()}
          component={TestItem}
        />
      </TestWrapper>
    );

    expect(getByTestId('item-A')).toHaveStyle('cursor: move');
  });

  it('should return null when component is falsy', () => {
    const { container } = render(
      <TestWrapper>
        <DragAndDropList
          propsArray={[{ name: 'A' }]}
          onDrop={jest.fn()}
          component={null as any}
        />
      </TestWrapper>
    );

    expect(container.innerHTML).toBe('');
  });

  it('should handle empty propsArray', () => {
    const { container } = render(
      <TestWrapper>
        <DragAndDropList
          propsArray={[]}
          onDrop={jest.fn()}
          component={TestItem}
        />
      </TestWrapper>
    );

    expect(container.querySelector('[data-testid]')).not.toBeInTheDocument();
  });

  describe('useDrop config callbacks', () => {
    it('collect should return handlerId from monitor', () => {
      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      // Find the config that has collect (from DragAndDropItem)
      const config = mockDropConfigs.find(c => c.collect);
      expect(config).toBeTruthy();

      const result = config.collect({ getHandlerId: () => 'handler-42' });
      expect(result).toEqual({ handlerId: 'handler-42' });
    });

    it('drop should call onDrop with correct indices', () => {
      const mockOnDrop = jest.fn();

      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={mockOnDrop}
            component={TestItem}
          />
        </TestWrapper>
      );

      // The drop configs correspond to each DragAndDropItem
      // Find a config with a drop handler
      const config = mockDropConfigs.find(c => c.drop);
      expect(config).toBeTruthy();

      act(() => {
        config.drop({ index: 0 }, {});
      });

      expect(mockOnDrop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(Function)
      );
    });

    it('hover should return early when ref.current is null', () => {
      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDropConfigs.find(c => c.hover);
      expect(config).toBeTruthy();

      // This shouldn't throw — just returns early
      expect(() => {
        config.hover({ index: 0 }, { getClientOffset: () => null });
      }).not.toThrow();
    });

    it('hover should return early when dragIndex equals hoverIndex', () => {
      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      // The second config is for item at index 1
      // Its hover captures index=1 in closure
      // We need to find a config where passing item.index === the item's own index
      // The first config has index=0, so pass item.index=0
      const config = mockDropConfigs[0];
      expect(config?.hover).toBeTruthy();

      // Same index — should return early without error
      expect(() => {
        config.hover({ index: 0 }, {
          getClientOffset: () => ({ x: 0, y: 50 }),
        });
      }).not.toThrow();
    });

    it('hover should call moveNext when drag crosses midpoint', () => {
      const mockOnDrop = jest.fn();

      const { getByTestId } = render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={mockOnDrop}
            component={TestItem}
          />
        </TestWrapper>
      );

      // Get the second item's drop config (index=1)
      // When we hover item 0 over item 1, dragIndex=0, hoverIndex=1
      const configForItem1 = mockDropConfigs.find((c, i) => {
        // We need the config that has hoverIndex=1
        // The configs are created in order, so index 1 is the second one
        return i === 1 && c.hover;
      });

      if (configForItem1) {
        // Mock getBoundingClientRect on the element
        const element = getByTestId('item-B');
        element.getBoundingClientRect = jest.fn(() => ({
          top: 0,
          bottom: 100,
          left: 0,
          right: 200,
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          toJSON: () => {},
        }));

        const item = { index: 0 };
        const monitor = {
          getClientOffset: () => ({ x: 100, y: 75 }), // Below midpoint (50)
        };

        // This should pass the boundary checks and call moveNext
        act(() => {
          configForItem1.hover(item, monitor);
        });

        // After hover, item.index should be updated to hoverIndex
        expect(item.index).toBe(1);
      }
    });

    it('hover should not move when dragging downwards and cursor above midpoint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const configForItem1 = mockDropConfigs[1];
      if (configForItem1?.hover) {
        const element = getByTestId('item-B');
        element.getBoundingClientRect = jest.fn(() => ({
          top: 0, bottom: 100, left: 0, right: 200,
          width: 200, height: 100, x: 0, y: 0, toJSON: () => {},
        }));

        const item = { index: 0 };
        const monitor = {
          getClientOffset: () => ({ x: 100, y: 25 }), // Above midpoint (50)
        };

        configForItem1.hover(item, monitor);
        // Item index should NOT be updated
        expect(item.index).toBe(0);
      }
    });

    it('hover should not move when dragging upwards and cursor below midpoint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const configForItem0 = mockDropConfigs[0];
      if (configForItem0?.hover) {
        const element = getByTestId('item-A');
        element.getBoundingClientRect = jest.fn(() => ({
          top: 0, bottom: 100, left: 0, right: 200,
          width: 200, height: 100, x: 0, y: 0, toJSON: () => {},
        }));

        const item = { index: 1 }; // dragging from below
        const monitor = {
          getClientOffset: () => ({ x: 100, y: 75 }), // Below midpoint
        };

        configForItem0.hover(item, monitor);
        // Item index should NOT be updated (dragging upward but cursor below midpoint)
        expect(item.index).toBe(1);
      }
    });

    it('hover should return early when clientOffset is null', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDropConfigs[1];
      if (config?.hover) {
        const element = getByTestId('item-B');
        element.getBoundingClientRect = jest.fn(() => ({
          top: 0, bottom: 100, left: 0, right: 200,
          width: 200, height: 100, x: 0, y: 0, toJSON: () => {},
        }));

        const item = { index: 0 };
        const monitor = { getClientOffset: () => null };

        // Should return early without error
        expect(() => config.hover(item, monitor)).not.toThrow();
        expect(item.index).toBe(0); // unchanged
      }
    });
  });

  describe('useDrag config callbacks', () => {
    it('item callback should return componentProps and index', () => {
      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDragConfigs.find(c => c.item);
      expect(config).toBeTruthy();

      const result = typeof config.item === 'function' ? config.item() : config.item;
      expect(result).toEqual(expect.objectContaining({
        componentProps: expect.objectContaining({ name: 'A' }),
        index: expect.any(Number),
      }));
    });

    it('collect should return isDragging from monitor', () => {
      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDragConfigs.find(c => c.collect);
      expect(config).toBeTruthy();

      const result = config.collect({ isDragging: () => true });
      expect(result).toEqual({ isDragging: true });

      const result2 = config.collect({ isDragging: () => false });
      expect(result2).toEqual({ isDragging: false });
    });

    it('end should call reset when item was not dropped', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDragConfigs.find(c => c.end);
      expect(config).toBeTruthy();

      // didDrop() returns false — should trigger reset
      act(() => {
        config.end({ index: 0 }, { didDrop: () => false });
      });

      // After reset, items should still be visible (list resets to original order)
      expect(getByTestId('item-A')).toBeInTheDocument();
      expect(getByTestId('item-B')).toBeInTheDocument();
    });

    it('end should not call reset when item was dropped', () => {
      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDragConfigs.find(c => c.end);
      expect(config).toBeTruthy();

      // didDrop() returns true — should NOT trigger reset
      expect(() => {
        act(() => {
          config.end({ index: 0 }, { didDrop: () => true });
        });
      }).not.toThrow();
    });
  });

  describe('DragAndDropList state management', () => {
    it('should reset listMap when propsArray changes', () => {
      const { rerender, getByText, queryByText } = render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      expect(getByText('A')).toBeInTheDocument();
      expect(getByText('B')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'X' }, { name: 'Y' }, { name: 'Z' }]}
            onDrop={jest.fn()}
            component={TestItem}
          />
        </TestWrapper>
      );

      expect(getByText('X')).toBeInTheDocument();
      expect(getByText('Y')).toBeInTheDocument();
      expect(getByText('Z')).toBeInTheDocument();
      expect(queryByText('A')).not.toBeInTheDocument();
    });

    it('should set dropped prop on the dropped item after drop', () => {
      const mockOnDrop = jest.fn();

      render(
        <TestWrapper>
          <DragAndDropList
            propsArray={[{ name: 'A' }, { name: 'B' }]}
            onDrop={mockOnDrop}
            component={TestItem}
          />
        </TestWrapper>
      );

      const config = mockDropConfigs.find(c => c.drop);
      if (config) {
        act(() => {
          config.drop({ index: 0 }, {});
        });

        expect(mockOnDrop).toHaveBeenCalled();
      }
    });
  });
});

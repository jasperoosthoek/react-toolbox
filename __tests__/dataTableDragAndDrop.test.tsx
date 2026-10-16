import React from 'react';
import { render, act } from '@testing-library/react';
import { TestBackend } from 'react-dnd-test-backend';
import { LocalizationProvider } from '../src/localization/LocalizationContext';
import { DataTable } from '../src/components/tables/DataTable';

// Use the real react-dnd (instead of __mocks__/react-dnd.js) with its test backend, so a drag through
// DataTable -> DragAndDropList -> row component is exercised end-to-end, including the ref on <tr>.
jest.unmock('react-dnd');
const { DndProvider, useDragDropManager } = jest.requireActual('react-dnd');

const data = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
];
const columns = [{ name: 'Name', selector: 'name' }];

let manager: any;
const CaptureManager = () => {
  manager = useDragDropManager();
  return null;
};

const renderTable = (props: Record<string, any> = {}) => {
  const onMove = jest.fn();
  const utils = render(
    <DndProvider backend={TestBackend}>
      <CaptureManager />
      <LocalizationProvider>
        <DataTable data={data} columns={columns as any} onMove={onMove} {...props} />
      </LocalizationProvider>
    </DndProvider>
  );
  const registry = manager.getRegistry();
  // One drag source and one drop target per row, registered in row order
  const sourceIds: string[] = [...registry.dragSources.keys()];
  const targetIds: string[] = [...registry.dropTargets.keys()];
  return { ...utils, onMove, sourceIds, targetIds };
};

// Simulate what a browser does: drag the row over each row on the way to `to`, which swaps the rows one step at a
// time, then drop it on its own (moved) row.
const drag = (sourceIds: string[], targetIds: string[], from: number, to: number) => {
  const backend = manager.getBackend();
  const offset = { clientOffset: { x: 0, y: 0 } };
  const step = to > from ? 1 : -1;

  act(() => backend.simulateBeginDrag([sourceIds[from]], { ...offset, getSourceClientOffset: () => ({ x: 0, y: 0 }) }));
  for (let i = from + step; i !== to + step; i += step) {
    act(() => backend.simulateHover([targetIds[i]], offset));
  }
  act(() => backend.simulateHover([targetIds[from]], offset));
  act(() => backend.simulateDrop());
  act(() => backend.simulateEndDrag());
};

describe('DataTable drag and drop (real react-dnd)', () => {
  it('registers a drag source and drop target for every row', () => {
    const { sourceIds, targetIds } = renderTable();
    expect(sourceIds).toHaveLength(3);
    expect(targetIds).toHaveLength(3);
  });

  it('passes the drag props from DragAndDropList on to the <tr>', () => {
    const { container, targetIds } = renderTable();
    const rows = container.querySelectorAll('tbody tr');
    expect([...rows].map((row) => row.getAttribute('data-handler-id'))).toEqual(targetIds);
    rows.forEach((row) => expect(row).toHaveStyle({ cursor: 'move', opacity: '1' }));
  });

  it('hides the dragged row while dragging', () => {
    const { container, sourceIds } = renderTable();
    const backend = manager.getBackend();
    act(() => backend.simulateBeginDrag([sourceIds[0]], { clientOffset: { x: 0, y: 0 }, getSourceClientOffset: () => ({ x: 0, y: 0 }) }));
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveStyle({ opacity: '0' });
    expect(rows[1]).toHaveStyle({ opacity: '1' });
    act(() => backend.simulateEndDrag());
  });

  it('calls onMove when dragging a row down', () => {
    const { onMove, sourceIds, targetIds } = renderTable();
    drag(sourceIds, targetIds, 0, 2);

    expect(onMove).toHaveBeenCalledTimes(1);
    const { item, target, reset } = onMove.mock.calls[0][0];
    expect(item).toBe(data[0]);
    expect(target).toBe(data[2]);
    expect(typeof reset).toBe('function');
  });

  it('calls onMove when dragging a row up', () => {
    const { onMove, sourceIds, targetIds } = renderTable();
    drag(sourceIds, targetIds, 2, 0);

    expect(onMove).toHaveBeenCalledTimes(1);
    const { item, target } = onMove.mock.calls[0][0];
    expect(item).toBe(data[2]);
    expect(target).toBe(data[0]);
  });

  it('does not call onMove when a row is dropped in its own place', () => {
    const { onMove, sourceIds, targetIds } = renderTable();
    drag(sourceIds, targetIds, 1, 1);
    expect(onMove).not.toHaveBeenCalled();
  });

  it('does not call onMove while moveIsLoading is set', () => {
    const { onMove, sourceIds, targetIds } = renderTable({ moveIsLoading: true });
    drag(sourceIds, targetIds, 0, 2);
    expect(onMove).not.toHaveBeenCalled();
  });
});

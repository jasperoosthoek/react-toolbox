import React, { forwardRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DragAndDropList, DragAndDropListComponentProps } from '../../../src/components/tables/DragAndDropList';

type Task = { id: number; title: string; done: boolean };

const tasks: Task[] = [
  { id: 1, title: 'Write the proposal', done: true },
  { id: 2, title: 'Review the budget', done: false },
  { id: 3, title: 'Plan the kick-off', done: false },
  { id: 4, title: 'Book the meeting room', done: false },
  { id: 5, title: 'Send the invitations', done: false },
];

// The list item must forward its ref and pass on style (the move cursor and the opacity while dragging) and the
// data-handler-id
const TaskItem = forwardRef<HTMLLIElement, DragAndDropListComponentProps>(
  ({ title, done, dropped, style, 'data-handler-id': handlerId }, ref) => (
    <li
      ref={ref}
      style={style}
      data-handler-id={handlerId}
      className={`list-group-item d-flex justify-content-between ${dropped ? 'list-group-item-success' : ''}`}
    >
      <span className={done ? 'text-decoration-line-through text-muted' : ''}>{title}</span>
      {dropped && <small className="text-success">moved</small>}
    </li>
  )
);

/**
 * The drag-and-drop behind `DataTable`'s `onMove`, for any list. `propsArray` holds the props of each item and
 * `component` renders one; the list reorders itself while dragging. `onDrop(movedIndex, index, reset)` gets the
 * original index of the dropped item and its new index; call `reset` to put it back. Needs a react-dnd `DndProvider`
 * (every story here has one).
 */
const meta = {
  title: 'Components/Tables/DragAndDropList',
  component: DragAndDropList,
  args: {
    propsArray: tasks,
    component: TaskItem as any,
    onDrop: fn(),
  },
  argTypes: {
    component: { control: false },
  },
  render: function Render({ propsArray, onDrop, ...args }) {
    const [items, setItems] = useState(propsArray as Task[]);
    return (
      <ul className="list-group" style={{ maxWidth: 400 }}>
        <DragAndDropList
          {...args}
          propsArray={items}
          onDrop={(movedIndex, index, reset) => {
            onDrop(movedIndex, index, reset);
            const next = [...items];
            const [moved] = next.splice(movedIndex, 1);
            next.splice(index, 0, moved);
            setItems(next);
          }}
        />
      </ul>
    );
  },
} satisfies Meta<typeof DragAndDropList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

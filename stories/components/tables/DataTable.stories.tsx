import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Badge } from 'react-bootstrap';
import { DataTable, DataTableColumn, OnMoveProps } from '../../../src/components/tables/DataTable';
import { mockUsers, User } from '../../../examples/data/mockData';

const statusBg = { active: 'success', inactive: 'secondary', pending: 'warning' } as const;

const formatSalary = (value: number) => `€ ${value.toLocaleString('en')}`;

const columns: DataTableColumn<User>[] = [
  { name: 'Name', selector: 'name', orderBy: 'name', search: 'name' },
  { name: 'Email', selector: 'email', search: 'email' },
  { name: 'Department', selector: 'department', orderBy: 'department', search: 'department' },
  {
    name: 'Status',
    selector: ({ status }) => <Badge bg={statusBg[status]}>{status}</Badge>,
    orderBy: 'status',
    search: 'status',
  },
  {
    name: 'Salary',
    selector: ({ salary }) => formatSalary(salary),
    orderBy: 'salary',
    value: 'salary',
    formatSum: formatSalary,
    className: 'text-end',
  },
];

/**
 * A table with search, sorting, pagination, sums and drag and drop. `columns` describes each column: what it shows
 * (`selector`), what it sorts on (`orderBy`), what the search looks in (`search`) and what it adds up (`value`).
 *
 * The labels ("Search", "Number of rows", the empty text) follow the language in the toolbar.
 */
const meta = {
  title: 'Components/Tables/DataTable',
  component: DataTable<User[]>,
  args: {
    data: mockUsers.slice(0, 25),
    columns,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100, null],
    orderByDefault: null,
    orderByDefaultDirection: 'asc',
    showHeader: true,
    showSum: false,
  },
  argTypes: {
    columns: { control: false },
    rowsPerPage: { control: { type: 'number', min: 1 } },
    orderByDefault: { control: 'select', options: [null, 'name', 'department', 'salary'] },
    orderByDefaultDirection: { control: 'inline-radio', options: ['asc', 'desc'] },
    showHeader: { control: 'boolean' },
    textOnEmpty: { control: 'text' },
    rowClassName: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof DataTable<User[]>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SortedBySalary: Story = {
  args: { orderByDefault: 'salary', orderByDefaultDirection: 'desc' },
};

export const WithSum: Story = {
  args: { showSum: true },
};

export const Empty: Story = {
  args: { data: [] },
};

export const CustomEmptyText: Story = {
  args: { data: [], textOnEmpty: 'No users match these filters' },
};

/** `showHeader` can also turn parts of the header off: `{ search: true, numberOfRows: false, pagination: false }`. */
export const WithoutHeader: Story = {
  args: { showHeader: false, rowsPerPage: null },
};

/** Click a row: `onClickRow` gets the row (see the Actions panel). */
export const ClickableRows: Story = {
  args: { onClickRow: fn() },
};

/** `rowClassName` can be a function of the row, here Bootstrap's `table-warning` for pending users. */
export const HighlightedRows: Story = {
  args: { rowClassName: (user: User) => (user.status === 'pending' ? 'table-warning' : '') },
};

/**
 * With `onMove` the rows can be dragged. `onMove` gets the dragged row (`item`), the row it was dropped on (`target`)
 * and `reset`, which puts the rows back when saving the new order fails. Dragging is off while the table is sorted
 * by a column.
 */
export const DragAndDrop: Story = {
  args: { onMove: fn(), rowsPerPage: null, data: mockUsers.slice(0, 8) },
  render: function Render({ data, onMove, ...args }) {
    const [rows, setRows] = useState(data);
    const handleMove = (move: OnMoveProps<User>) => {
      onMove?.(move);
      // Move the dragged row to the position of the target row
      const next = [...rows];
      next.splice(rows.indexOf(move.item), 1);
      next.splice(rows.indexOf(move.target), 0, move.item);
      setRows(next);
    };
    return <DataTable {...args} data={rows} onMove={handleMove} />;
  },
};

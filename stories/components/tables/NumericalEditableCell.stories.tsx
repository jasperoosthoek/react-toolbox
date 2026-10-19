import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import { Table } from 'react-bootstrap';
import {
  EditCellProvider,
  NumericalEditableCell,
} from '../../../src/components/tables/NumericalEditableCell';

/**
 * Click the number to edit it. Enter or leaving the input saves (`onSave` gets a number, or `null` when empty), Escape
 * cancels. Cells must be inside an `EditCellProvider`, which makes sure only one cell is edited at a time.
 */
const meta = {
  title: 'Components/Tables/NumericalEditableCell',
  component: NumericalEditableCell,
  decorators: [
    (Story) => (
      <EditCellProvider>
        <Story />
      </EditCellProvider>
    ),
  ],
  args: {
    row: 1,
    col: 'hours',
    value: 8,
    integer: false,
    inputDisabled: false,
    onSave: fn(),
  },
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    placeholder: { control: 'text' },
    title: { control: 'text' },
    displayValue: { control: 'text' },
    component: { control: false },
    extraMenuOptions: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <NumericalEditableCell
        {...args}
        onSave={(value) => {
          args.onSave(value);
          updateArgs({ value });
        }}
      />
    );
  },
} satisfies Meta<typeof NumericalEditableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Integer: Story = {
  args: { integer: true, min: 0, max: 40, title: 'Whole hours, 0 to 40' },
};

export const Disabled: Story = {
  args: { inputDisabled: true, title: 'This week is locked' },
};

/** `extraMenuOptions` adds actions below the input that can change the value before it is saved. */
export const WithMenu: Story = {
  args: {
    extraMenuOptions: [
      { label: 'Copy from last week (6)', onClick: (_, { setValue }) => setValue('6') },
      { label: 'Double', onClick: (current, { setValue }) => setValue(String(Number(current) * 2)) },
      { label: 'Clear', onClick: (_, { setValue }) => setValue('') },
    ],
  },
};

/** In a table: pass `component="td"` so the cell is the table cell itself. */
export const InATable: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [data, setData] = useState<Record<string, (number | null)[]>>({
      Alice: [8, 6, 8, 7, 4],
      Bob: [4, 8, null, 8, 8],
    });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return (
      <Table bordered size="sm" style={{ width: 'auto' }}>
        <thead>
          <tr><th />{days.map(day => <th key={day} className="text-end">{day}</th>)}</tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([name, values]) => (
            <tr key={name}>
              <th>{name}</th>
              {values.map((value, day) => (
                <NumericalEditableCell
                  key={day}
                  component="td"
                  className="text-end"
                  row={name}
                  col={day}
                  value={value}
                  onSave={(newValue) => setData({
                    ...data,
                    [name]: values.map((v, i) => (i === day ? newValue : v)),
                  })}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
};

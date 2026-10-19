import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import { SearchBox } from '../../../src/components/tables/SearchBox';

/**
 * A controlled search input. The clear and search buttons only appear when `onClear` and `onSearch` are given. Without
 * `placeholder` it shows the localized "Search"; `placeholder={false}` shows none.
 */
const meta = {
  title: 'Components/Tables/SearchBox',
  component: SearchBox,
  args: {
    value: '',
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <SearchBox
        {...args}
        onChange={(value) => {
          args.onChange(value);
          updateArgs({ value });
        }}
        onClear={args.onClear && (() => {
          args.onClear!();
          updateArgs({ value: '' });
        })}
      />
    );
  },
} satisfies Meta<typeof SearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithButtons: Story = {
  args: { value: 'Alice', onClear: fn(), onSearch: fn() },
};

export const WithLabel: Story = {
  args: { label: 'Find a user', placeholder: 'Name or email' },
};

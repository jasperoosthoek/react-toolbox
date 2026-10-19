import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AiOutlineHeart, AiOutlineStar, AiOutlineBell } from 'react-icons/ai';
import { FiSettings, FiMail } from 'react-icons/fi';
import * as IconButtons from '../../../src/components/buttons/IconButtons';
import { IconButton } from '../../../src/components/buttons/IconButtons';

const icons = { AiOutlineHeart, AiOutlineStar, AiOutlineBell, FiSettings, FiMail };

// Every ready-made button (CheckButton, CopyButton, ...): the exports made with makeIconButton
const namedButtons = Object.entries(IconButtons)
  .filter(([name]) => name.endsWith('Button') && !['IconButton', 'UploadTextButton'].includes(name))
  .sort(([a], [b]) => a.localeCompare(b)) as [string, (props: IconButtons.ButtonProps) => React.ReactElement][];

const variants = [
  'light', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'link',
  'outline-primary', 'outline-secondary', 'outline-danger',
];

const meta = {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
  args: {
    icon: AiOutlineHeart,
    variant: 'light',
    size: 'sm',
    loading: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    icon: { control: 'select', options: Object.keys(icons), mapping: icons },
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'lg', undefined] },
    iconSize: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = {
  args: { children: 'Like' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving' },
};

/** All ready-made buttons, such as `<EditButton />` and `<DeleteButton />`. The controls apply to every button. */
export const AllButtons: Story = {
  render: ({ icon, ...args }) => (
    <div className="d-flex flex-wrap gap-3">
      {namedButtons.map(([name, Button]) => (
        <div key={name} className="text-center" style={{ width: 130 }}>
          <Button {...args} />
          <div className="small text-muted mt-1">{name}</div>
        </div>
      ))}
    </div>
  ),
};

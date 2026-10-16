import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import DeleteConfirmButton from '../../../src/components/buttons/DeleteConfirmButton';

/**
 * A `DeleteButton` that asks for confirmation before calling `onDelete`. The title, body and confirm text default to
 * the localized "Delete" and "Are you sure?".
 */
const meta = {
  title: 'Components/Buttons/DeleteConfirmButton',
  component: DeleteConfirmButton,
  args: {
    onDelete: fn(),
    variant: 'light',
    size: 'sm',
    loading: false,
    disabled: false,
  },
  argTypes: {
    modalTitle: { control: 'text' },
    modalBody: { control: 'text' },
    confirmText: { control: 'text' },
    children: { control: 'text' },
    variant: { control: 'select', options: ['light', 'danger', 'outline-danger', 'secondary', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'lg', undefined] },
  },
} satisfies Meta<typeof DeleteConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = {
  args: { children: 'Delete', variant: 'outline-danger' },
};

export const CustomTexts: Story = {
  args: {
    modalTitle: 'Delete user',
    modalBody: 'Alice Brown will lose access immediately.',
    confirmText: 'Delete user',
  },
};

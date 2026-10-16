import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SetPasswordPage } from '../../../src/components/login/SetPasswordPage';

/**
 * A new password, entered twice. The Save button is enabled when both match; then `onSubmit({ password }, callback)`
 * is called. `error` shows a message above the form, such as an expired reset link.
 */
const meta = {
  title: 'Components/Login/SetPasswordPage',
  component: SetPasswordPage,
  args: {
    error: null,
    onSubmit: fn(),
    onBackToLogin: fn(),
    colSizes: [2, 8, 2],
  },
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    onBackToLogin: { control: false },
  },
} satisfies Meta<typeof SetPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'This reset link has expired. Request a new one.' },
};

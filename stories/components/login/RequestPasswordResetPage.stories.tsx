import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RequestPasswordResetPage } from '../../../src/components/login/RequestPasswordResetPage';

/**
 * Asks for an email address to send a reset link to: `onSubmit({ email }, callback)`. Set `success` once the link was
 * sent to show the confirmation instead of the form. `onBackToLogin` is a URL or a function.
 */
const meta = {
  title: 'Components/Login/RequestPasswordResetPage',
  component: RequestPasswordResetPage,
  args: {
    success: false,
    onSubmit: fn(),
    onBackToLogin: fn(),
    colSizes: [2, 8, 2],
  },
  argTypes: {
    label: { control: 'text' },
    onBackToLogin: { control: false },
  },
} satisfies Meta<typeof RequestPasswordResetPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LinkSent: Story = {
  args: { success: true },
};

/** `colSizes` are the Bootstrap column widths left of, of and right of the form. */
export const Narrow: Story = {
  args: { colSizes: [4, 4, 4] },
};

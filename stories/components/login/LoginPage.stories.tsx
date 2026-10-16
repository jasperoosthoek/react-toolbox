import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LoginPage, LoginPageProps } from '../../../src/components/login/LoginPage';

/**
 * An email and password form. `onSubmit({ email, password }, callback)` is called with Enter or the button, once both
 * are filled in. `onResetPassword` is a URL or a function. Renders nothing when `isAuthenticated`. All texts follow the
 * language in the toolbar.
 */
const meta = {
  title: 'Components/Login/LoginPage',
  component: LoginPage,
  args: {
    isAuthenticated: false,
    onSubmit: fn(),
    // A URL or a function: typed as the prop so a story can pass a URL
    onResetPassword: fn() as LoginPageProps['onResetPassword'],
  },
  argTypes: {
    label: { control: 'text' },
    onResetPassword: { control: false },
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: 'Sign in to the dashboard' },
};

export const ResetPasswordLink: Story = {
  args: { onResetPassword: '/reset-password' },
};

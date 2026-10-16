import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormCheckbox, FormSwitch } from '../../../src/components/forms/fields/FormCheckbox';
import { withFormProvider } from './withFormProvider';

/** A boolean field. `FormSwitch` is the same field shown as a switch. */
const meta = {
  title: 'Components/Forms/FormCheckbox',
  component: FormCheckbox,
  decorators: [withFormProvider],
  args: {
    name: 'newsletter',
    label: 'Send me the newsletter',
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof FormCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  parameters: { initialValue: true },
};

export const Switch: Story = {
  args: { name: 'notifications', label: 'Notifications' },
  render: (args) => <FormSwitch {...args} />,
};

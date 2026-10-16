import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormInput, FormTextarea, FormDate, FormDateTime } from '../../../src/components/forms/fields/FormInput';
import { withFormProvider } from './withFormProvider';

/**
 * A text input bound to a field of the surrounding `FormProvider` by `name`. Other `<input>` attributes (`type`,
 * `placeholder`, `min`, ...) are passed on.
 */
const meta = {
  title: 'Components/Forms/FormInput',
  component: FormInput,
  decorators: [withFormProvider],
  args: {
    name: 'name',
    label: 'Name',
    placeholder: 'Your full name',
    required: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
    inputComponent: { control: false },
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Submit while empty to see the required message. */
export const Required: Story = {
  args: { required: true },
};

export const NumberInput: Story = {
  args: { name: 'age', label: 'Age', type: 'number', min: 0, placeholder: undefined },
  parameters: { initialValue: 42 },
};

export const Textarea: Story = {
  args: { name: 'notes', label: 'Notes', placeholder: 'Anything we should know?', rows: 4 },
  render: (args) => <FormTextarea {...args} />,
};

export const DateInput: Story = {
  args: { name: 'birthday', label: 'Birthday', placeholder: undefined },
  parameters: { initialValue: '1990-05-17' },
  render: (args) => <FormDate {...args} />,
};

/** The value is an ISO date-time string; the input shows it in the local time zone, or in `timezone`. */
export const DateTime: Story = {
  args: { name: 'starts_at', label: 'Starts at', placeholder: undefined },
  parameters: { initialValue: '2026-10-16T14:30:00Z' },
  render: ({ value, onChange, ...args }) => <FormDateTime {...args} />,
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSelect } from '../../../src/components/forms/fields/FormSelect';
import { withFormProvider } from './withFormProvider';

const meta = {
  title: 'Components/Forms/FormSelect',
  component: FormSelect,
  decorators: [withFormProvider],
  args: {
    name: 'department',
    label: 'Department',
    options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'finance', label: 'Finance', disabled: true },
    ],
    placeholder: 'Choose a department',
    required: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: 'design' },
};

export const Required: Story = {
  args: { required: true },
};

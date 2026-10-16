import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormCheckboxGroup } from '../../../src/components/forms/fields/FormCheckboxGroup';
import { withFormProvider } from './withFormProvider';

/** Several checkboxes for one field; the value is an array of the checked options' values. */
const meta = {
  title: 'Components/Forms/FormCheckboxGroup',
  component: FormCheckboxGroup,
  decorators: [withFormProvider],
  args: {
    name: 'days',
    label: 'Available on',
    options: [
      { value: 'mon', label: 'Monday' },
      { value: 'tue', label: 'Tuesday' },
      { value: 'wed', label: 'Wednesday' },
      { value: 'thu', label: 'Thursday' },
      { value: 'fri', label: 'Friday', disabled: true },
    ],
    required: false,
    disabled: false,
    integer: false,
  },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof FormCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: ['mon', 'wed'] },
};

/** With `integer` the values are stored as numbers. */
export const IntegerValues: Story = {
  args: {
    name: 'team_ids',
    label: 'Teams',
    integer: true,
    options: [
      { value: 1, label: 'Backend' },
      { value: 2, label: 'Frontend' },
      { value: 3, label: 'Data' },
    ],
  },
  parameters: { initialValue: [2] },
};

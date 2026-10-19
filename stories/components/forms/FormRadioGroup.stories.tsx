import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormRadioGroup } from '../../../src/components/forms/fields/FormRadioGroup';
import { withFormProvider } from './withFormProvider';

/** Radio buttons for one field; the value is the chosen option's value. */
const meta = {
  title: 'Components/Forms/FormRadioGroup',
  component: FormRadioGroup,
  decorators: [withFormProvider],
  args: {
    name: 'plan',
    label: 'Plan',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'enterprise', label: 'Enterprise', disabled: true },
    ],
    required: false,
    disabled: false,
    integer: false,
  },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof FormRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: 'pro' },
};

export const Required: Story = {
  args: { required: true },
};

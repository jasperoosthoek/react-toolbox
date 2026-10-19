import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormDateRange } from '../../../src/components/forms/fields/FormDateRange';
import { withFormProvider } from './withFormProvider';

/**
 * Two date inputs for one field; the value is `{ from, to }` (or the keys in `fromKey` and `toKey`). Submitting with
 * the end before the start shows an error.
 */
const meta = {
  title: 'Components/Forms/FormDateRange',
  component: FormDateRange,
  decorators: [withFormProvider],
  args: {
    name: 'period',
    label: 'Period',
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    separator: { control: 'text' },
    inputComponent: { control: false },
  },
} satisfies Meta<typeof FormDateRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: { from: '2026-10-01', to: '2026-10-31' } },
};

export const CustomKeys: Story = {
  args: { name: 'contract', label: 'Contract', fromKey: 'start_date', toKey: 'end_date', separator: 'until' },
  parameters: { initialValue: { start_date: '2026-01-01', end_date: '' } },
};

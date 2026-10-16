import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIndicator } from '../../../src/components/indicators/CheckIndicator';

/** A green check or a red cross, for example in a table column. */
const meta = {
  title: 'Components/Indicators/CheckIndicator',
  component: CheckIndicator,
  args: { checked: true },
} satisfies Meta<typeof CheckIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {};

export const Unchecked: Story = {
  args: { checked: false },
};

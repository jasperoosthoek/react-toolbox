import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FixedLoadingIndicator } from '../../../src/components/indicators/FixedLoadingIndicator';

/**
 * A spinner with a message in a fixed position on the screen, for work that doesn't belong to one element (saving a new
 * order, a bulk delete).
 */
const meta = {
  title: 'Components/Indicators/FixedLoadingIndicator',
  component: FixedLoadingIndicator,
  args: {
    show: true,
    message: 'Saving changes...',
    variant: 'info',
    position: { top: '20px', right: '20px' },
  },
  argTypes: {
    variant: { control: 'select', options: ['info', 'warning', 'success', 'danger', 'primary', 'secondary'] },
  },
  decorators: [
    // A transform makes this box the containing block of the fixed indicator, so it stays inside the story instead of
    // covering the Docs page
    (Story) => (
      <div style={{ transform: 'translateZ(0)', height: 160, border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FixedLoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BottomLeft: Story = {
  args: {
    message: 'Deleting 3 items...',
    variant: 'warning',
    position: { bottom: '20px', left: '20px' },
  },
};

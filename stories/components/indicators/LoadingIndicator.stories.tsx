import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingIndicator, SmallSpinner, BigSpinner } from '../../../src/components/indicators/LoadingIndicator';

/** A page-wide "Information is being loaded..." block; the text follows the language in the toolbar. */
const meta = {
  title: 'Components/Indicators/LoadingIndicator',
  component: LoadingIndicator,
  args: { style: {} },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `SmallSpinner` renders a disabled link button by default, so it lines up with other buttons. */
export const Small: Story = {
  parameters: { controls: { disable: true } },
  render: () => <SmallSpinner />,
};

export const Big: Story = {
  parameters: { controls: { disable: true } },
  render: () => <BigSpinner />,
};

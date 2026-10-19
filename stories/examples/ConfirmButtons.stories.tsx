// Each story renders an example from examples/components unchanged, with the example's own code view.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ConfirmButtonExample,
  DeleteConfirmButtonExample,
  AdvancedConfirmButtonExample,
} from '../../examples/components/ButtonComponentsExamples';

const meta = {
  title: 'Examples/ConfirmButtons',
  parameters: {
    // The examples show their own code, the generated source would only be <SomeExample />
    docs: { canvas: { sourceState: 'none' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmButton: Story = {
  render: () => <ConfirmButtonExample />,
};

export const DeleteConfirmButton: Story = {
  render: () => <DeleteConfirmButtonExample />,
};

export const Advanced: Story = {
  render: () => <AdvancedConfirmButtonExample />,
};

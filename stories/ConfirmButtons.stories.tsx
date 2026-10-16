// Phase 1 of the Storybook port: each story renders an example from examples/components unchanged.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ConfirmButtonExample,
  DeleteConfirmButtonExample,
  AdvancedConfirmButtonExample,
} from '../examples/components/ButtonComponentsExamples';

const meta = {
  title: 'Buttons/ConfirmButtons',
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

// Phase 1 of the Storybook port: each story renders an example from examples/components unchanged.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CustomFormExample,
  ModalFormExample,
  FlexibleFormExample,
  RendererFormExample,
  MixedFormExample,
} from '../examples/components/FormExamples';

const meta = {
  title: 'Forms',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomForm: Story = {
  render: () => <CustomFormExample />,
};

export const ModalForm: Story = {
  render: () => <ModalFormExample />,
};

export const FlexibleLayout: Story = {
  render: () => <FlexibleFormExample />,
};

export const CustomRenderers: Story = {
  render: () => <RendererFormExample />,
};

export const Mixed: Story = {
  render: () => <MixedFormExample />,
};

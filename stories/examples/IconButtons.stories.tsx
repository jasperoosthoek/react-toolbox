// Each story renders an example from examples/components unchanged, with the example's own code view.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AllIconButtonsExample,
  ButtonSizesAndVariantsExample,
  CustomIconButtonsExample,
  IconButtonWithTextExample,
  ButtonGroupsExample,
  UploadTextButtonExample,
} from '../../examples/components/IconButtonsExamples';

const meta = {
  title: 'Examples/IconButtons',
  parameters: {
    // The examples show their own code, the generated source would only be <SomeExample />
    docs: { canvas: { sourceState: 'none' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIconButtons: Story = {
  render: () => <AllIconButtonsExample />,
};

export const SizesAndVariants: Story = {
  render: () => <ButtonSizesAndVariantsExample />,
};

export const CustomIconButtons: Story = {
  render: () => <CustomIconButtonsExample />,
};

export const WithText: Story = {
  render: () => <IconButtonWithTextExample />,
};

export const ButtonGroups: Story = {
  render: () => <ButtonGroupsExample />,
};

export const UploadTextButton: Story = {
  render: () => <UploadTextButtonExample />,
};

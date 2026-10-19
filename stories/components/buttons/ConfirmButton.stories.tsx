import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from 'react-bootstrap';
import ConfirmButton from '../../../src/components/buttons/ConfirmButton';
import { CheckButton, SendButton } from '../../../src/components/buttons/IconButtons';

const buttonComponents = { Button, CheckButton, SendButton };

/**
 * A button that asks for confirmation in a modal before calling `onConfirm`. Without `modalBody`, `confirmText` or
 * `cancelText` the modal uses the localized defaults ("Are you sure?", "OK", "Cancel"): switch the language in the
 * toolbar to see them translated.
 */
const meta = {
  title: 'Components/Buttons/ConfirmButton',
  component: ConfirmButton,
  args: {
    buttonComponent: Button,
    children: 'Publish',
    variant: 'primary',
    modalTitle: 'Publish article',
    closeUsingCallback: false,
    loading: false,
    onConfirm: fn(),
  },
  argTypes: {
    buttonComponent: { control: 'select', options: Object.keys(buttonComponents), mapping: buttonComponents },
    modalTitle: { control: 'text' },
    modalBody: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof ConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTexts: Story = {
  args: {
    modalBody: 'The article will be visible to everyone.',
    confirmText: 'Publish now',
    cancelText: 'Not yet',
  },
};

export const IconButtonTrigger: Story = {
  args: {
    buttonComponent: CheckButton as typeof Button,
    children: undefined,
    variant: 'light',
  },
};

/**
 * With `closeUsingCallback` the modal stays open until `onConfirm` calls `closeModal`, here after a second. Set
 * `loading` while the work is in progress to show a spinner in the modal.
 */
export const CloseUsingCallback: Story = {
  args: {
    closeUsingCallback: true,
    onConfirm: fn((closeModal: () => void) => {
      setTimeout(closeModal, 1000);
    }),
  },
};

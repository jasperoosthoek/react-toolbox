// Phase 1 of the Storybook port: each story renders an example from examples/components unchanged.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BasicLocalizationExample,
  CustomLocalizationExample,
  FormLocalizationExample,
  DataTableLocalizationExample,
  LanguageSwitcherExample,
  LocalizationReferenceExample,
} from '../examples/components/LocalizationExamples';

const meta = {
  title: 'Localization',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <BasicLocalizationExample />,
};

export const CustomStrings: Story = {
  render: () => <CustomLocalizationExample />,
};

export const Forms: Story = {
  render: () => <FormLocalizationExample />,
};

export const DataTable: Story = {
  render: () => <DataTableLocalizationExample />,
};

export const LanguageSwitcher: Story = {
  render: () => <LanguageSwitcherExample />,
};

export const Reference: Story = {
  render: () => <LocalizationReferenceExample />,
};

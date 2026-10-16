// Phase 1 of the Storybook port: each story renders an example from examples/components unchanged.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BasicDataTableExample,
  PaginatedDataTableExample,
  EditableDataTableExample,
  DragDropDataTableExample,
  CustomRendererDataTableExample,
  IntegratedFormDataTableExample,
} from '../examples/components/DataTableExamples';

const meta = {
  title: 'Tables/DataTable',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <BasicDataTableExample />,
};

export const Paginated: Story = {
  render: () => <PaginatedDataTableExample />,
};

export const Editable: Story = {
  render: () => <EditableDataTableExample />,
};

export const DragAndDrop: Story = {
  render: () => <DragDropDataTableExample />,
};

export const CustomRenderers: Story = {
  render: () => <CustomRendererDataTableExample />,
};

export const WithForms: Story = {
  render: () => <IntegratedFormDataTableExample />,
};

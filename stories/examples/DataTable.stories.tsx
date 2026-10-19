// Each story renders an example from examples/components unchanged, with the example's own code view.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BasicDataTableExample,
  PaginatedDataTableExample,
  EditableDataTableExample,
  DragDropDataTableExample,
  CustomRendererDataTableExample,
  IntegratedFormDataTableExample,
} from '../../examples/components/DataTableExamples';

const meta = {
  title: 'Examples/DataTable',
  parameters: {
    // The examples show their own code, the generated source would only be <SomeExample />
    docs: { canvas: { sourceState: 'none' } },
  },
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

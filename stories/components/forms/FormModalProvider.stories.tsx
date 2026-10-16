import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  FormModalProvider,
  FormCreateModalButton,
  FormEditModalButton,
} from '../../../src/components/forms/FormModalProvider';
import { DataTable } from '../../../src/components/tables/DataTable';
import { userFormFields, validateUser } from './userFormFields';
import { mockUsers, User } from '../../../examples/data/mockData';

type Row = Pick<User, 'id' | 'name' | 'email' | 'department' | 'status'>;

/**
 * Create and edit modals for a list of items. `FormCreateModalButton` opens an empty form, `FormEditModalButton` (or
 * `useFormModal().showEditModal(item)`) opens the form filled in with an item. Saving calls `onCreate` or `onUpdate`
 * (or `onSave` for both) with the form data and a callback that closes the modal.
 *
 * Inside a `FormModalProvider`, `<DataTable showEditModalOnClickRow />` opens the edit modal when a row is clicked.
 * The default modal titles are the localized "Create" and "Edit".
 */
const meta = {
  title: 'Components/Forms/FormModalProvider',
  component: FormModalProvider,
  args: {
    formFields: userFormFields,
    createModalTitle: 'New user',
    editModalTitle: 'Edit user',
    loading: false,
    onCreate: fn(),
    onUpdate: fn(),
    children: null,
  },
  argTypes: {
    formFields: { control: false },
    createModalTitle: { control: 'text' },
    editModalTitle: { control: 'text' },
    width: { control: 'select', options: [undefined, 25, 50, 75, 100] },
    validate: { control: false },
    modalChildren: { control: false },
    children: { control: false },
    // Callbacks typed as any: without this Storybook offers an object control for them
    onSave: { control: false },
    onCreate: { control: false },
    onUpdate: { control: false },
    includeData: { control: 'object' },
  },
  render: function Render({ onCreate, onUpdate, ...args }) {
    const [users, setUsers] = useState<Row[]>(
      mockUsers.slice(0, 5).map(({ id, name, email, department, status }) => ({ id, name, email, department, status }))
    );
    return (
      <FormModalProvider
        {...args}
        onCreate={(data: Row, close: () => void) => {
          onCreate(data);
          setUsers([...users, { ...data, id: Math.max(...users.map(u => u.id)) + 1 }]);
          close();
        }}
        onUpdate={(data: Row, close: () => void) => {
          onUpdate(data);
          setUsers(users.map(user => (user.id === data.id ? { ...user, ...data } : user)));
          close();
        }}
      >
        <FormCreateModalButton variant="primary" className="mb-3">New user</FormCreateModalButton>
        <DataTable
          data={users}
          showEditModalOnClickRow
          showHeader={false}
          rowsPerPage={null}
          columns={[
            { name: 'Name', selector: 'name' },
            { name: 'Email', selector: 'email' },
            { name: 'Department', selector: 'department' },
            { name: 'Status', selector: 'status' },
            { name: '', selector: (user) => <FormEditModalButton state={user} />, className: 'text-end' },
          ]}
        />
      </FormModalProvider>
    );
  },
} satisfies Meta<typeof FormModalProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Save a user with an email without @ to see the error. */
export const WithValidation: Story = {
  args: { validate: validateUser },
};

export const DefaultTitles: Story = {
  args: { createModalTitle: undefined, editModalTitle: undefined },
};

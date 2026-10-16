import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from 'react-bootstrap';
import { FormProvider, useForm } from '../../../src/components/forms/FormProvider';
import { FormFieldsRenderer } from '../../../src/components/forms/FormModal';
import { FormInput } from '../../../src/components/forms/fields/FormInput';
import { FormSelect } from '../../../src/components/forms/fields/FormSelect';
import { userFormFields, validateUser } from './userFormFields';

const FormButtons = () => {
  const { submit, resetForm, modified, loading, formData } = useForm();
  return (
    <>
      <div className="d-flex gap-2 align-items-center my-3">
        <Button onClick={submit} disabled={loading}>Save</Button>
        <Button variant="outline-secondary" onClick={resetForm} disabled={!modified}>Reset</Button>
        {loading && <span className="text-muted">Saving...</span>}
        {modified && !loading && <span className="text-muted">Unsaved changes</span>}
      </div>
      <pre className="small bg-light border p-2 mb-0">{JSON.stringify(formData, null, 2)}</pre>
    </>
  );
};

/**
 * Holds the state of a form: the values, whether it was modified, the validation errors and loading. `formFields`
 * describes the fields (label, type, required, initial value, options); the field components and `useForm()` read and
 * write the state by field name.
 *
 * `onSubmit(data, callback)` is only called when the form validates: required fields must be filled in and
 * `validate(data)` must return no errors. Call `callback` when saving is done to end the loading state.
 */
const meta = {
  title: 'Components/Forms/FormProvider',
  component: FormProvider,
  args: {
    formFields: userFormFields,
    initialState: {},
    loading: false,
    resetAfterSubmit: true,
    // Saves after half a second
    onSubmit: fn((data, callback) => {
      setTimeout(() => callback?.(), 500);
    }),
    children: null,
  },
  argTypes: {
    formFields: { control: false },
    validate: { control: false },
    children: { control: false },
    resetTrigger: { control: false },
  },
  render: (args) => (
    <FormProvider {...args}>
      <FormFieldsRenderer />
      <FormButtons />
    </FormProvider>
  ),
} satisfies Meta<typeof FormProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `FormFieldsRenderer` renders every field of `formFields` with the component for its type. */
export const Default: Story = {};

export const InitialState: Story = {
  args: {
    initialState: { name: 'Alice Brown', email: 'alice.brown@example.com', department: 'Marketing', salary: 90000 },
  },
};

/** Save with an email without @ to see the error from `validate`. */
export const Validation: Story = {
  args: {
    validate: validateUser,
    initialState: { name: 'Alice Brown', email: 'alice.brown' },
  },
};

/** Place the fields yourself; each finds its configuration in `formFields` by `name`. */
export const CustomLayout: Story = {
  render: (args) => (
    <FormProvider {...args}>
      <div className="row">
        <div className="col-md-6"><FormInput name="name" /></div>
        <div className="col-md-6"><FormInput name="email" /></div>
      </div>
      <FormSelect name="department" options={userFormFields.department.options} />
      <FormButtons />
    </FormProvider>
  ),
};

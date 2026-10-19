import type { FormFields } from '../../../src/components/forms/FormProvider';

// The fields of the user forms in the FormProvider, FormModal and FormModalProvider stories: one of each type that
// FormFieldsRenderer knows
export const userFormFields = {
  name: { label: 'Name', required: true, placeholder: 'Full name' },
  email: { label: 'Email', required: true, formProps: { type: 'email' } },
  department: {
    label: 'Department',
    type: 'select',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Design', label: 'Design' },
      { value: 'Marketing', label: 'Marketing' },
    ],
  },
  status: {
    label: 'Status',
    type: 'radio',
    initialValue: 'active',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  salary: { label: 'Salary', type: 'number' },
  notes: { label: 'Notes', type: 'textarea', rows: 2 },
  newsletter: { label: 'Receives the newsletter', type: 'checkbox', initialValue: false },
} satisfies FormFields;

// Email must contain an @: shows how validate adds errors next to the required checks
export const validateUser = (data: { email?: unknown }) => ({
  email: data.email && !String(data.email).includes('@') ? 'Enter a valid email address' : undefined,
});

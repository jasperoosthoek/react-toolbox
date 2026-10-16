import React from 'react';
import type { Decorator } from '@storybook/react-vite';
import { Button } from 'react-bootstrap';
import { action } from 'storybook/actions';
import { FormProvider, useForm } from '../../../src/components/forms/FormProvider';
import { FormValue } from '../../../src/components/forms/FormFields';

const FormState = () => {
  const { formData, submit, resetForm, submitAttempted, validationErrors } = useForm();
  return (
    <div className="mt-3 pt-3 border-top">
      <div className="d-flex gap-2 mb-2">
        <Button size="sm" onClick={submit}>Submit</Button>
        <Button size="sm" variant="outline-secondary" onClick={resetForm}>Reset</Button>
      </div>
      <pre className="small bg-light border p-2 mb-0">
        {JSON.stringify({ formData, ...submitAttempted && { validationErrors } }, null, 2)}
      </pre>
    </div>
  );
};

/**
 * Form fields read and write their value through a FormProvider. This decorator wraps the story in one with a single
 * field, named after the story's `name` arg and required when the `required` arg is set, and shows the form data and a
 * Submit button below it (to see the validation). The field's starting value is the `initialValue` parameter.
 */
export const withFormProvider: Decorator = (Story, { args, parameters }) => {
  const name = args.name as string;
  const initialValue = parameters.initialValue as FormValue | undefined;
  return (
    <FormProvider
      // Start over when the field changes name or starting value
      key={`${name} ${JSON.stringify(initialValue)}`}
      formFields={{ [name]: { required: !!args.required, initialValue } }}
      onSubmit={(data, callback) => {
        action('onSubmit')(data);
        callback?.();
      }}
    >
      <Story />
      <FormState />
    </FormProvider>
  );
};

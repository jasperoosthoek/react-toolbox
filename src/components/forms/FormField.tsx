import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from './FormProvider';
import { FormValue } from './FormFields';

export interface FormFieldProps {
  name: string;
  children?: React.ReactNode;
}

export const FormField = ({ name, children }: FormFieldProps) => {
  const {
    formFields,
    formData,
    pristine,
    validated,
    validationErrors,
    getValue,
    setValue,
    submit,
    hasProvider
  } = useForm();

  if (!hasProvider || !formData || !formFields) {
    console.error('FormField must be used within a FormProvider');
    return null;
  }

  const fieldConfig = formFields[name];
  if (!fieldConfig) {
    console.error(`FormField: No field configuration found for "${name}"`);
    return null;
  }

  const { formProps = {}, label, component: Component, required } = fieldConfig;
  const isInvalid = !pristine && !!(!validated && validationErrors[name]);
  const value = getValue(name);

  // If children are provided, render them instead of the default field
  if (children) {
    return (
      <Form.Group controlId={name}>
        {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
        {isInvalid && ` (${validationErrors[name]})`}
        {children}
      </Form.Group>
    );
  }

  return (
    <Form.Group controlId={name}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && ` (${validationErrors[name]})`}
      {Component
        ? <Component
            keyName={name}
            pristine={pristine}
            isInvalid={isInvalid}
            value={formData[name]}
            state={formData}
            setState={(newState = {}) => {
              // Update form data with new state
              Object.entries(newState).forEach(([k, v]) => {
                setValue(k, v);
              });
            }}
            onChange={(value: FormValue) => setValue(name, value)}
            initialState={formData}
            initialValue={formData[name]}
            {...formProps}
          />
        : <Form.Control
            as="input"
            autoComplete="off"
            {...formProps}
            value={value}
            isInvalid={isInvalid}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setValue(name, e.target.value);
            }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && formProps.as !== 'textarea') {
                // Pressing the enter key will save data unless it is a multi line text area
                e.preventDefault();
                submit();
              }
            }}
          />
      }
    </Form.Group>
  );
};

// Hook to get form field value and setter for a specific field
export const useFormField = (name: string) => {
  const { getValue, setValue, formFields, validationErrors, pristine, validated } = useForm();
  
  const fieldConfig = formFields[name];
  const isInvalid = !pristine && !!(!validated && validationErrors[name]);
  const error = validationErrors[name];
  
  return {
    value: getValue(name),
    setValue: (value: FormValue) => setValue(name, value),
    error,
    isInvalid,
    required: fieldConfig?.required || false,
    label: fieldConfig?.label,
  };
};

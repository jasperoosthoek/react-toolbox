import React from 'react';
import { useForm } from './FormProvider';
import { FormValue } from './FormFields';
import { FormInput, FormInputProps } from './FormInput';

// FormField is now just a convenience wrapper around FormInput
export interface FormFieldProps extends FormInputProps {
  children?: React.ReactNode;
}

export const FormField = ({ children, ...props }: FormFieldProps) => {
  const { formFields, hasProvider } = useForm();

  if (!hasProvider || !formFields) {
    console.error('FormField must be used within a FormProvider');
    return null;
  }

  const fieldConfig = formFields[props.name];
  if (!fieldConfig) {
    console.error(`FormField: No field configuration found for "${props.name}"`);
    return null;
  }

  // If children are provided, render a custom wrapper
  if (children) {
    return (
      <div className="form-group">
        {children}
      </div>
    );
  }

  // Otherwise, render as FormInput
  return <FormInput {...props} />;
};

// Hook to get form field value and setter for a specific field
export const useFormField = (name: string) => {
  const { 
    getValue, 
    setValue, 
    formFields, 
    validationErrors, 
    pristine, 
    validated, 
    submit,
    hasProvider 
  } = useForm();
  
  if (!hasProvider) {
    console.error('useFormField must be used within a FormProvider');
    return {
      value: '',
      onChange: () => {},
      isInvalid: false,
      error: null,
      config: null,
      submit: () => {},
    };
  }

  const fieldConfig = formFields[name];
  if (!fieldConfig) {
    console.error(`useFormField: No field configuration found for "${name}"`);
  }
  
  const isInvalid = !pristine && !!(!validated && validationErrors[name]);
  const error = validationErrors[name];
  
  return {
    value: getValue(name),
    onChange: (value: FormValue) => setValue(name, value),
    isInvalid,
    error,
    config: fieldConfig,
    submit,
  };
};

import React from 'react';
import { render } from '@testing-library/react';
import { LocalizationProvider } from '../../localization/LocalizationContext';
import { FormProvider } from '../../components/forms/FormProvider';

/**
 * Basic wrapper with LocalizationProvider for components that need localization
 */
export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

/**
 * Render function that automatically wraps with LocalizationProvider
 */
export const renderWithLocalization = (ui: React.ReactElement, options = {}) => {
  return render(
    <TestWrapper>
      {ui}
    </TestWrapper>,
    options
  );
};

/**
 * Form wrapper with both LocalizationProvider and FormProvider
 */
export interface FormTestWrapperProps {
  children: React.ReactNode;
  formFields?: any;
  onSubmit?: any;
  validate?: any;
  initialState?: any;
  loading?: boolean;
}

export const FormTestWrapper = ({ 
  children, 
  formFields, 
  onSubmit, 
  validate,
  initialState,
  loading = false
}: FormTestWrapperProps) => {
  const defaultSubmit = jest.fn();

  return (
    <LocalizationProvider>
      <FormProvider 
        formFields={formFields || {}}
        onSubmit={onSubmit || defaultSubmit}
        validate={validate}
        initialState={initialState}
        loading={loading}
      >
        {children}
      </FormProvider>
    </LocalizationProvider>
  );
};

/**
 * Render function that automatically wraps with FormProvider and LocalizationProvider
 */
export const renderWithFormProvider = (
  ui: React.ReactElement, 
  options: Partial<FormTestWrapperProps> = {}
) => {
  return render(
    <FormTestWrapper {...options}>
      {ui}
    </FormTestWrapper>
  );
};

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FormField, useFormField } from '../components/forms/FormField';
import { FormProvider } from '../components/forms/FormProvider';

// Mock FormInput component
jest.mock('../components/forms/fields/FormInput', () => ({
  FormInput: ({ name, ...props }: any) => (
    <input data-testid={`form-input-${name}`} {...props} />
  ),
}));

describe('FormField', () => {
  const mockFormFields = {
    username: {
      label: 'Username',
      required: true,
      formProps: { placeholder: 'Enter username' },
    },
    email: {
      label: 'Email',
      required: false,
      formProps: { type: 'email' },
    },
  };

  const mockFormValues = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const renderWithFormProvider = (ui: React.ReactElement, formValues = mockFormValues) => {
    return render(
      <FormProvider 
        formFields={mockFormFields}
        initialState={formValues}
        onSubmit={jest.fn()}
      >
        {ui}
      </FormProvider>
    );
  };

  describe('FormField Component', () => {
    it('should render FormInput when no children provided', () => {
      const { getByTestId } = renderWithFormProvider(
        <FormField name="username" />
      );

      expect(getByTestId('form-input-username')).toBeInTheDocument();
    });

    it('should render custom children when provided', () => {
      const { getByTestId, queryByTestId } = renderWithFormProvider(
        <FormField name="username">
          <div data-testid="custom-field">Custom Field Content</div>
        </FormField>
      );

      expect(getByTestId('custom-field')).toBeInTheDocument();
      expect(queryByTestId('form-input-username')).not.toBeInTheDocument();
    });

    it('should return null when used outside FormProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { container } = render(<FormField name="username" />);

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('FormField must be used within a FormProvider');
      
      consoleSpy.mockRestore();
    });

    it('should return null when field configuration not found', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { container } = renderWithFormProvider(
        <FormField name="nonexistent" />
      );

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('FormField: No field configuration found for \"nonexistent\"');
      
      consoleSpy.mockRestore();
    });

    it('should wrap children in form-group div', () => {
      const { container } = renderWithFormProvider(
        <FormField name="username">
          <span>Custom content</span>
        </FormField>
      );

      const formGroup = container.querySelector('.form-group');
      expect(formGroup).toBeInTheDocument();
      expect(formGroup).toContainHTML('<span>Custom content</span>');
    });
  });

  describe('useFormField Hook', () => {
    const TestComponent = ({ 
      name, 
      label, 
      required, 
      ...props 
    }: { 
      name: string; 
      label?: string; 
      required?: boolean; 
      [key: string]: any;
    }) => {
      const formField = useFormField({ name, label, required, ...props });
      
      return (
        <div data-testid="test-component">
          <input
            data-testid={`field-${name}`}
            value={formField.value || ''}
            onChange={(e) => formField.onChange(e.target.value)}
          />
          <span data-testid="label">{formField.label}</span>
          <span data-testid="required">{formField.required ? 'required' : 'optional'}</span>
          <span data-testid="invalid">{formField.isInvalid ? 'invalid' : 'valid'}</span>
          <span data-testid="error">{formField.error || 'no-error'}</span>
          {Object.keys(formField.mergedProps).map(key => (
            <span key={key} data-testid={`prop-${key}`}>{formField.mergedProps[key]}</span>
          ))}
        </div>
      );
    };

    it('should return form field data', () => {
      const { getByTestId } = renderWithFormProvider(
        <TestComponent name="username" />
      );

      expect(getByTestId('field-username')).toHaveValue('testuser');
      expect(getByTestId('label')).toHaveTextContent('Username');
      expect(getByTestId('required')).toHaveTextContent('required');
      expect(getByTestId('invalid')).toHaveTextContent('valid');
    });

    it('should use component props over config props', () => {
      const { getByTestId } = renderWithFormProvider(
        <TestComponent 
          name="username" 
          label="Custom Label" 
          required={false}
        />
      );

      expect(getByTestId('label')).toHaveTextContent('Custom Label');
      expect(getByTestId('required')).toHaveTextContent('optional');
    });

    it('should merge props correctly', () => {
      const { getByTestId } = renderWithFormProvider(
        <TestComponent 
          name="username" 
          customProp="custom-value"
          placeholder="Override placeholder"
        />
      );

      expect(getByTestId('prop-placeholder')).toHaveTextContent('Override placeholder');
      expect(getByTestId('prop-customProp')).toHaveTextContent('custom-value');
    });

    it('should handle onChange', () => {
      const { getByTestId } = renderWithFormProvider(
        <TestComponent name="username" />
      );

      const input = getByTestId('field-username');
      fireEvent.change(input, { target: { value: 'newvalue' } });

      expect(input).toHaveValue('newvalue');
    });

    it('should return default values when used outside FormProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { getByTestId } = render(<TestComponent name="username" />);

      expect(getByTestId('field-username')).toHaveValue('');
      expect(getByTestId('label')).toBeEmptyDOMElement();
      expect(getByTestId('required')).toHaveTextContent('optional');
      expect(getByTestId('invalid')).toHaveTextContent('valid');
      expect(getByTestId('error')).toHaveTextContent('no-error');
      expect(consoleSpy).toHaveBeenCalledWith('useFormField must be used within a FormProvider');
      
      consoleSpy.mockRestore();
    });

    it('should handle missing field configuration', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { getByTestId } = renderWithFormProvider(
        <TestComponent name="nonexistent" />
      );

      expect(getByTestId('field-nonexistent')).toHaveValue('');
      expect(consoleSpy).toHaveBeenCalledWith('useFormField: No field configuration found for \"nonexistent\"');
      
      consoleSpy.mockRestore();
    });

    it('should show validation errors when field is invalid', () => {
      const mockFormValuesWithErrors = {};
      const mockValidationErrors = {
        username: 'Username is required'
      };

      const { getByTestId } = render(
        <FormProvider 
          formFields={mockFormFields}
          initialState={mockFormValuesWithErrors}
          onSubmit={jest.fn()}
          pristine={false}
          validated={false}
          validationErrors={mockValidationErrors}
        >
          <TestComponent name="username" />
        </FormProvider>
      );

      expect(getByTestId('invalid')).toHaveTextContent('invalid');
      expect(getByTestId('error')).toHaveTextContent('Username is required');
    });

    it('should not show validation errors when pristine', () => {
      const mockValidationErrors = {
        username: 'Username is required'
      };

      const { getByTestId } = render(
        <FormProvider 
          formFields={mockFormFields}
          initialState={{}}
          onSubmit={jest.fn()}
          pristine={true}
          validated={false}
          validationErrors={mockValidationErrors}
        >
          <TestComponent name="username" />
        </FormProvider>
      );

      expect(getByTestId('invalid')).toHaveTextContent('valid');
      expect(getByTestId('error')).toHaveTextContent('no-error');
    });

    it('should not show validation errors when validated successfully', () => {
      const mockValidationErrors = {
        username: 'Username is required'
      };

      const { getByTestId } = render(
        <FormProvider 
          formFields={mockFormFields}
          initialState={{}}
          onSubmit={jest.fn()}
          pristine={false}
          validated={true}
          validationErrors={mockValidationErrors}
        >
          <TestComponent name="username" />
        </FormProvider>
      );

      expect(getByTestId('invalid')).toHaveTextContent('valid');
      expect(getByTestId('error')).toHaveTextContent('no-error');
    });

    it('should handle undefined prop values', () => {
      const { getByTestId } = renderWithFormProvider(
        <TestComponent 
          name="username" 
          label={undefined} 
          required={undefined}
        />
      );

      // Should use config values when component props are undefined
      expect(getByTestId('label')).toHaveTextContent('Username');
      expect(getByTestId('required')).toHaveTextContent('required');
    });
  });
});

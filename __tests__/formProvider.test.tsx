import React from 'react';

// Core Form Components
import { FormProvider, useForm } from '../src/components/forms/FormProvider';
import { FormField, useFormField } from '../src/components/forms/FormField';
import { FormInput } from '../src/components/forms/fields/FormInput';

// Import test utilities
import {
  TestWrapper,
  FormTestWrapper,
  render,
  fireEvent,
} from './utils';

describe('Form Provider Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('FormProvider', () => {
    const mockOnSubmit = jest.fn();
    const mockValidate = jest.fn();

    it('should be a valid React component', () => {
      expect(typeof FormProvider).toBe('function');
    });

    it('should render FormProvider without crashing', () => {
      const formFields = {
        name: { initialValue: '', required: true },
        email: { initialValue: '', required: false },
      };

      expect(() => {
        render(
          <TestWrapper>
            <FormProvider formFields={formFields} onSubmit={mockOnSubmit}>
              <div>Form Content</div>
            </FormProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle complex form configurations', () => {
      const complexFormFields = {
        name: {
          initialValue: '',
          required: true,
          type: 'string',
          label: 'Full Name',
          onChange: (value: any) => ({ name: value.toUpperCase() })
        },
        email: {
          initialValue: '',
          required: true,
          type: 'string',
          label: 'Email Address'
        },
        age: {
          initialValue: 0,
          required: false,
          type: 'number'
        },
        active: {
          initialValue: false,
          required: false,
          type: 'boolean'
        },
        department: {
          initialValue: '',
          required: true,
          type: 'select',
          options: [
            { value: 'it', label: 'IT' },
            { value: 'hr', label: 'HR' },
          ]
        }
      };

      expect(() => {
        render(
          <TestWrapper>
            <FormProvider
              formFields={complexFormFields}
              onSubmit={mockOnSubmit}
              validate={mockValidate}
              loading={false}
              initialState={{ name: 'John', email: 'john@example.com' }}
              resetTrigger={1}
            >
              <div>Complex Form</div>
            </FormProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should return null for invalid formFields', () => {
      const { container } = render(
        <TestWrapper>
          <FormProvider formFields={null as any} onSubmit={mockOnSubmit}>
            <div>Content</div>
          </FormProvider>
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('useForm Hook', () => {
    it('should provide form context values', () => {
      const formFields = {
        name: { initialValue: 'test', required: true, label: 'Name' },
      };

      const TestComponent = () => {
        const { formData, getValue, validated, loading, hasProvider } = useForm();
        return (
          <div>
            <span data-testid="has-provider">{hasProvider.toString()}</span>
            <span data-testid="validated">{validated.toString()}</span>
            <span data-testid="loading">{loading.toString()}</span>
            <span data-testid="name-value">{getValue('name')}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()}>
            <TestComponent />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByTestId('has-provider')).toHaveTextContent('true');
      expect(getByTestId('name-value')).toHaveTextContent('test');
    });

    it('should handle setValue correctly', () => {
      const formFields = {
        name: { initialValue: '', required: true, label: 'Name' },
      };

      const TestComponent = () => {
        const { getValue, setValue } = useForm();
        return (
          <div>
            <span data-testid="name-value">{getValue('name')}</span>
            <button onClick={() => setValue('name', 'updated')} data-testid="update-btn">
              Update
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()}>
            <TestComponent />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByTestId('name-value')).toHaveTextContent('');
      fireEvent.click(getByTestId('update-btn'));
      expect(getByTestId('name-value')).toHaveTextContent('updated');
    });

    it('should handle submit correctly', () => {
      const mockSubmit = jest.fn();
      const formFields = {
        name: { initialValue: 'test', required: true, label: 'Name' },
      };

      const TestComponent = () => {
        const { submit } = useForm();
        return (
          <button onClick={submit} data-testid="submit-btn">Submit</button>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={mockSubmit}>
            <TestComponent />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('submit-btn'));
      expect(mockSubmit).toHaveBeenCalled();
    });

    it('should handle resetForm correctly', () => {
      const formFields = {
        name: { initialValue: 'initial', required: true, label: 'Name' },
      };

      const TestComponent = () => {
        const { getValue, setValue, resetForm } = useForm();
        return (
          <div>
            <span data-testid="name-value">{getValue('name')}</span>
            <button onClick={() => setValue('name', 'changed')} data-testid="change-btn">
              Change
            </button>
            <button onClick={resetForm} data-testid="reset-btn">Reset</button>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()}>
            <TestComponent />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('change-btn'));
      expect(getByTestId('name-value')).toHaveTextContent('changed');

      fireEvent.click(getByTestId('reset-btn'));
      expect(getByTestId('name-value')).toHaveTextContent('initial');
    });
  });

  describe('FormField and useFormField Hook', () => {
    it('should render FormField without crashing', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormField name="test-input" label="Test" />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle useFormField hook', () => {
      const TestComponent = () => {
        const { value, onChange, isInvalid, label } = useFormField({ name: 'test-input' });
        return (
          <div>
            <span data-testid="value">{String(value)}</span>
            <span data-testid="is-invalid">{isInvalid.toString()}</span>
          </div>
        );
      };

      expect(() => {
        render(
          <FormTestWrapper>
            <TestComponent />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should be valid React components and hooks', () => {
      expect(typeof FormField).toBe('function');
      expect(typeof useFormField).toBe('function');
    });
  });

  describe('Validation', () => {
    it('should block submit when validation fails', () => {
      const mockSubmit = jest.fn();
      const mockValidate = jest.fn(() => ({ name: 'Name is required' }));

      const formFields = {
        name: { initialValue: '', required: true, label: 'Name' },
      };

      const TestComponent = () => {
        const { submit } = useForm();
        return (
          <div>
            <FormInput name="name" />
            <button onClick={submit} data-testid="submit-btn">Submit</button>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider
            formFields={formFields}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestComponent />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('submit-btn'));
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should allow submit when validation passes', () => {
      const mockSubmit = jest.fn();
      const mockValidate = jest.fn(() => ({}));

      const formFields = {
        name: { initialValue: 'valid', required: true, label: 'Name' },
      };

      const TestComponent = () => {
        const { submit } = useForm();
        return (
          <button onClick={submit} data-testid="submit-btn">Submit</button>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider
            formFields={formFields}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestComponent />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('submit-btn'));
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});

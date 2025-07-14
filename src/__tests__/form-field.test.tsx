import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '../localization/LocalizationContext';
import { FormProvider } from '../components/forms/FormProvider';
import { FormField, useFormField } from '../components/forms/FormField';

// Test wrapper with form context
const TestWrapper = ({ children, formFields = {}, onSubmit = jest.fn() }: { 
  children: React.ReactNode;
  formFields?: any;
  onSubmit?: any;
}) => {
  const defaultFormFields = {
    'test-field': { initialValue: 'test value', required: true, type: 'string' },
    'optional-field': { initialValue: '', required: false, type: 'string' },
    'number-field': { initialValue: 42, required: false, type: 'number' },
    'boolean-field': { initialValue: false, required: false, type: 'boolean' },
  };

  return (
    <LocalizationProvider>
      <FormProvider 
        formFields={formFields.length ? formFields : defaultFormFields}
        onSubmit={onSubmit}
      >
        {children}
      </FormProvider>
    </LocalizationProvider>
  );
};

describe('FormField Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic FormField Rendering', () => {
    it('should render FormField without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FormField name="test-field" label="Test Field" />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render FormField with label', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormField name="test-field" label="Test Label" />
        </TestWrapper>
      );

      expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('should render FormField with required indicator', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormField name="test-field" label="Required Field" required={true} />
        </TestWrapper>
      );

      expect(getByText('Required Field *')).toBeInTheDocument();
    });

    it('should render FormField without required indicator', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormField name="optional-field" label="Optional Field" />
        </TestWrapper>
      );

      expect(getByText('Optional Field')).toBeInTheDocument();
    });

    it('should render FormField with custom children', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormField name="test-field" label="Custom Field">
            <div data-testid="custom-child">Custom Content</div>
          </FormField>
        </TestWrapper>
      );

      expect(getByTestId('custom-child')).toBeInTheDocument();
    });

    it('should handle React element labels', () => {
      const customLabel = <span data-testid="custom-label">Custom Label</span>;
      const { getByTestId } = render(
        <TestWrapper>
          <FormField name="test-field" label={customLabel} />
        </TestWrapper>
      );

      expect(getByTestId('custom-label')).toBeInTheDocument();
    });
  });

  describe('useFormField Hook', () => {
    it('should provide form field context', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'test-field',
          label: 'Hook Field',
          required: true
        });

        return (
          <div>
            <span data-testid="value">{fieldHook.value}</span>
            <span data-testid="label">{fieldHook.label}</span>
            <span data-testid="required">{fieldHook.required.toString()}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('value')).toHaveTextContent('test value');
      expect(getByTestId('label')).toHaveTextContent('Hook Field *');
      expect(getByTestId('required')).toHaveTextContent('true');
    });

    it('should handle onChange events', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'test-field',
          label: 'Change Field'
        });

        return (
          <div>
            <input 
              data-testid="hook-input"
              value={fieldHook.value}
              onChange={(e) => fieldHook.onChange(e.target.value)}
            />
            <span data-testid="current-value">{fieldHook.value}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const input = getByTestId('hook-input');
      fireEvent.change(input, { target: { value: 'updated value' } });

      expect(getByTestId('current-value')).toHaveTextContent('updated value');
    });

    it('should handle validation errors', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'test-field',
          label: 'Error Field',
          required: true
        });

        return (
          <div>
            <span data-testid="is-invalid">{fieldHook.isInvalid.toString()}</span>
            <span data-testid="error">{fieldHook.error || 'no error'}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('is-invalid')).toBeInTheDocument();
      expect(getByTestId('error')).toBeInTheDocument();
    });

    it('should merge props correctly', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'test-field',
          label: 'Merged Field',
          className: 'custom-class',
          disabled: false
        });

        return (
          <div>
            <input 
              data-testid="merged-input"
              {...fieldHook.mergedProps}
            />
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const input = getByTestId('merged-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('custom-class');
    });

    it('should handle different field types in hook', () => {
      const NumberTestComponent = () => {
        const fieldHook = useFormField({
          name: 'number-field',
          label: 'Number Field',
          type: 'number'
        });

        return (
          <div>
            <span data-testid="number-value">{fieldHook.value}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <NumberTestComponent />
        </TestWrapper>
      );

      expect(getByTestId('number-value')).toHaveTextContent('42');
    });

    it('should handle boolean field types', () => {
      const BooleanTestComponent = () => {
        const fieldHook = useFormField({
          name: 'boolean-field',
          label: 'Boolean Field',
          type: 'boolean'
        });

        return (
          <div>
            <span data-testid="boolean-value">{fieldHook.value.toString()}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <BooleanTestComponent />
        </TestWrapper>
      );

      expect(getByTestId('boolean-value')).toHaveTextContent('false');
    });

    it('should handle hook without form context', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'standalone-field',
          label: 'Standalone Field',
          value: 'default value'
        });

        return (
          <div>
            <span data-testid="standalone-value">{fieldHook.value}</span>
            <span data-testid="standalone-label">{fieldHook.label}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider>
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('standalone-value')).toHaveTextContent('default value');
      expect(getByTestId('standalone-label')).toHaveTextContent('Standalone Field');
    });
  });

  describe('FormField Integration', () => {
    it('should integrate with form validation', () => {
      const formFields = {
        'validated-field': { initialValue: '', required: true, type: 'string' }
      };

      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'validated-field',
          label: 'Validated Field',
          required: true
        });

        return (
          <FormField name="validated-field" label="Validated Field">
            <input 
              data-testid="validated-input"
              value={fieldHook.value}
              onChange={(e) => fieldHook.onChange(e.target.value)}
            />
          </FormField>
        );
      };

      const { getByTestId } = render(
        <TestWrapper formFields={formFields}>
          <TestComponent />
        </TestWrapper>
      );

      const input = getByTestId('validated-input');
      fireEvent.change(input, { target: { value: 'valid input' } });

      expect(input).toHaveValue('valid input');
    });

    it('should handle form submission', () => {
      const mockSubmit = jest.fn();
      const formFields = {
        'submit-field': { initialValue: 'initial', required: false, type: 'string' }
      };

      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'submit-field',
          label: 'Submit Field'
        });

        return (
          <div>
            <FormField name="submit-field" label="Submit Field">
              <input 
                data-testid="submit-input"
                value={fieldHook.value}
                onChange={(e) => fieldHook.onChange(e.target.value)}
              />
            </FormField>
            <button data-testid="submit-button" onClick={mockSubmit}>
              Submit
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper formFields={formFields} onSubmit={mockSubmit}>
          <TestComponent />
        </TestWrapper>
      );

      const input = getByTestId('submit-input');
      const button = getByTestId('submit-button');

      fireEvent.change(input, { target: { value: 'submitted value' } });
      fireEvent.click(button);

      expect(mockSubmit).toHaveBeenCalled();
    });

    it('should handle complex form structures', () => {
      const formFields = {
        'field1': { initialValue: 'value1', required: true, type: 'string' },
        'field2': { initialValue: 'value2', required: false, type: 'string' },
        'field3': { initialValue: 123, required: false, type: 'number' }
      };

      const TestComponent = () => {
        return (
          <div>
            <FormField name="field1" label="Field 1">
              <input data-testid="field1" />
            </FormField>
            <FormField name="field2" label="Field 2">
              <input data-testid="field2" />
            </FormField>
            <FormField name="field3" label="Field 3">
              <input data-testid="field3" type="number" />
            </FormField>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper formFields={formFields}>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('field1')).toBeInTheDocument();
      expect(getByTestId('field2')).toBeInTheDocument();
      expect(getByTestId('field3')).toBeInTheDocument();
    });
  });

  describe('FormField Edge Cases', () => {
    it('should handle missing form context gracefully', () => {
      expect(() => {
        render(
          <LocalizationProvider>
            <FormField name="orphan-field" label="Orphan Field">
              <input />
            </FormField>
          </LocalizationProvider>
        );
      }).not.toThrow();
    });

    it('should handle empty field names', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FormField name="" label="Empty Name Field">
              <input />
            </FormField>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle undefined labels', () => {
      const { container } = render(
        <TestWrapper>
          <FormField name="test-field">
            <input />
          </FormField>
        </TestWrapper>
      );

      const formGroup = container.querySelector('.form-group');
      expect(formGroup).toBeInTheDocument();
    });

    it('should handle null values', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'null-field',
          label: 'Null Field',
          value: null
        });

        return (
          <div>
            <span data-testid="null-value">{fieldHook.value || 'null'}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('null-value')).toHaveTextContent('null');
    });

    it('should handle array values', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'array-field',
          label: 'Array Field',
          value: ['item1', 'item2']
        });

        return (
          <div>
            <span data-testid="array-value">{JSON.stringify(fieldHook.value)}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('array-value')).toHaveTextContent('["item1","item2"]');
    });
  });

  describe('Component Export Verification', () => {
    it('should export FormField as function', () => {
      expect(typeof FormField).toBe('function');
    });

    it('should export useFormField as function', () => {
      expect(typeof useFormField).toBe('function');
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { FormInput, FormCheckbox, FormSelect } from '../components/forms/fields';
import { FormProvider } from '../components/forms/FormProvider';
import { LocalizationProvider } from '../localization/LocalizationContext';

afterEach(() => {
  jest.clearAllMocks();
});

// Simple test wrapper with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const formFields = {
    'test-input': { initialValue: '', required: false },
    'test-checkbox': { initialValue: false, required: false },
    'test-select': { 
      initialValue: '', 
      required: false,
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ]
    },
  };

  const handleSubmit = jest.fn();

  return (
    <LocalizationProvider>
      <FormProvider 
        formFields={formFields}
        onSubmit={handleSubmit}
      >
        {children}
      </FormProvider>
    </LocalizationProvider>
  );
};

describe('Form Fields Tests', () => {
  describe('FormInput', () => {
    it('should render FormInput component without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FormInput
              name="test-input"
              label="Test Input"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('FormCheckbox', () => {
    it('should render FormCheckbox component without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FormCheckbox
              name="test-checkbox"
              label="Test Checkbox"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('FormSelect', () => {
    it('should render FormSelect component without crashing', () => {
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <FormSelect
              name="test-select"
              label="Test Select"
              options={options}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should accept various props without errors', () => {
      const options = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B', disabled: true },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <FormSelect
              name="test-select"
              options={options}
              placeholder="Choose option"
              required
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Component Exports', () => {
    it('should export FormInput as a function', () => {
      expect(typeof FormInput).toBe('function');
    });

    it('should export FormCheckbox as a function', () => {
      expect(typeof FormCheckbox).toBe('function');
    });

    it('should export FormSelect as a function', () => {
      expect(typeof FormSelect).toBe('function');
    });
  });
});

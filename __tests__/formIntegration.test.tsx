import React from 'react';

// Core Form Components
import { FormProvider, useForm } from '../src/components/forms/FormProvider';
import { FormModal, FormFieldsRenderer } from '../src/components/forms/FormModal';
import { FormField, useFormField } from '../src/components/forms/FormField';
import {
  FormModalProvider,
  FormCreateModalButton,
  FormEditModalButton,
  useFormModal
} from '../src/components/forms/FormModalProvider';

// Form Field Components
import {
  FormInput,
  FormTextarea,
  FormDate,
  FormDateTime
} from '../src/components/forms/fields/FormInput';
import {
  FormCheckbox,
  FormSwitch
} from '../src/components/forms/fields/FormCheckbox';
import { FormSelect } from '../src/components/forms/fields/FormSelect';
import { FormDropdown } from '../src/components/forms/fields/FormDropdown';
import {
  FormBadgesSelection,
  BadgeSelection
} from '../src/components/forms/fields/FormBadgesSelection';

// Import test utilities
import {
  TestWrapper,
  FormTestWrapper,
  render,
} from './utils';

describe('Form Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Form Workflow', () => {
    it('should handle complete form workflow', () => {
      const formFields = {
        name: { initialValue: '', required: true, type: 'string' },
        email: { initialValue: '', required: true, type: 'string' },
        active: { initialValue: false, required: false, type: 'boolean' },
        department: {
          initialValue: '',
          required: true,
          type: 'select',
          options: [
            { value: 'it', label: 'IT' },
            { value: 'hr', label: 'HR' },
          ]
        },
        skills: {
          initialValue: [],
          required: false,
          type: 'badges'
        }
      };

      const mockSubmit = jest.fn();
      const mockValidate = jest.fn(() => ({}));

      expect(() => {
        render(
          <TestWrapper>
            <FormProvider
              formFields={formFields}
              onSubmit={mockSubmit}
              validate={mockValidate}
            >
              <FormInput name="name" label="Full Name" />
              <FormInput name="email" label="Email" type="email" />
              <FormCheckbox name="active" label="Active User" />
              <FormSelect
                name="department"
                label="Department"
                options={formFields.department.options}
              />
              <FormBadgesSelection
                name="skills"
                label="Skills"
                list={[
                  { id: 1, name: 'JavaScript' },
                  { id: 2, name: 'React' },
                  { id: 3, name: 'TypeScript' },
                ]}
              />
            </FormProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle form with all field types', () => {
      const formFields = {
        text: { initialValue: '', required: true, type: 'string', label: 'Text' },
        number: { initialValue: 0, required: false, type: 'number', label: 'Number' },
        checkbox: { initialValue: false, required: false, type: 'boolean', label: 'Checkbox' },
        select: {
          initialValue: '',
          required: false,
          type: 'select',
          label: 'Select',
          options: [{ value: 'a', label: 'A' }]
        },
        textarea: { initialValue: '', required: false, type: 'textarea', label: 'Textarea' },
      };

      expect(() => {
        render(
          <TestWrapper>
            <FormProvider formFields={formFields} onSubmit={jest.fn()}>
              <FormInput name="text" />
              <FormInput name="number" type="number" />
              <FormCheckbox name="checkbox" />
              <FormSelect name="select" options={formFields.select.options} />
              <FormTextarea name="textarea" />
            </FormProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Hook Integration Tests', () => {
    it('should handle useForm hook integration', () => {
      const TestFormComponent = () => {
        const {
          formData,
          getValue,
          setValue,
          submit,
          resetForm,
          validated,
          loading,
          hasProvider
        } = useForm();

        return (
          <div>
            <span>Has Provider: {hasProvider.toString()}</span>
            <span>Validated: {validated.toString()}</span>
            <span>Loading: {loading.toString()}</span>
            <button onClick={() => setValue('test-input', 'new value')}>
              Set Value
            </button>
            <button onClick={submit}>Submit</button>
            <button onClick={resetForm}>Reset</button>
          </div>
        );
      };

      expect(() => {
        render(
          <FormTestWrapper>
            <TestFormComponent />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle useFormField hook integration', () => {
      const TestFieldComponent = () => {
        const { value, onChange, isInvalid, error, label } = useFormField({
          name: 'test-input'
        });

        return (
          <div>
            <span>Value: {String(value)}</span>
            <span>Invalid: {isInvalid.toString()}</span>
          </div>
        );
      };

      expect(() => {
        render(
          <FormTestWrapper>
            <TestFieldComponent />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle useFormModal hook integration', () => {
      const TestModalComponent = () => {
        const { hasProvider, showCreateModal, showEditModal } = useFormModal();

        return (
          <div>
            <span>Has Provider: {hasProvider.toString()}</span>
            <button onClick={() => showCreateModal()}>Create</button>
            <button onClick={() => showEditModal({ id: 1 })}>Edit</button>
          </div>
        );
      };

      const formFields = {
        name: { initialValue: '', required: true, label: 'Name' },
      };

      expect(() => {
        render(
          <TestWrapper>
            <FormModalProvider formFields={formFields} onCreate={jest.fn()}>
              <TestModalComponent />
            </FormModalProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Component Export Verification', () => {
    it('should export all core form components as functions', () => {
      expect(typeof FormProvider).toBe('function');
      expect(typeof FormModal).toBe('function');
      expect(typeof FormModalProvider).toBe('function');
      expect(typeof FormField).toBe('function');
      expect(typeof useForm).toBe('function');
      expect(typeof useFormField).toBe('function');
      expect(typeof useFormModal).toBe('function');
    });

    it('should export all form field components as functions', () => {
      expect(typeof FormInput).toBe('function');
      expect(typeof FormTextarea).toBe('function');
      expect(typeof FormDate).toBe('function');
      expect(typeof FormDateTime).toBe('function');
      expect(typeof FormCheckbox).toBe('function');
      expect(typeof FormSwitch).toBe('function');
      expect(typeof FormSelect).toBe('function');
      expect(typeof FormDropdown).toBe('function');
      expect(typeof FormBadgesSelection).toBe('function');
      expect(typeof BadgeSelection).toBe('function');
    });

    it('should export FormModal as function', () => {
      expect(typeof FormModal).toBe('function');
    });

    it('should export FormFieldsRenderer as function', () => {
      expect(typeof FormFieldsRenderer).toBe('function');
    });

    it('should export FormCreateModalButton as function', () => {
      expect(typeof FormCreateModalButton).toBe('function');
    });

    it('should export FormEditModalButton as function', () => {
      expect(typeof FormEditModalButton).toBe('function');
    });
  });

  describe('Form and Modal Integration', () => {
    it('should render FormModal with FormFieldsRenderer', () => {
      const formFields = {
        name: { initialValue: '', required: true, type: 'string', label: 'Name' },
        email: { initialValue: '', required: false, type: 'string', label: 'Email' },
      };

      expect(() => {
        render(
          <TestWrapper>
            <FormProvider formFields={formFields} onSubmit={jest.fn()}>
              <FormModal show={true} onHide={jest.fn()} modalTitle="Test Form">
                <FormFieldsRenderer />
              </FormModal>
            </FormProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render FormModalProvider with create/edit buttons', () => {
      const formFields = {
        name: { initialValue: '', required: true, type: 'string', label: 'Name' },
      };

      expect(() => {
        render(
          <TestWrapper>
            <FormModalProvider
              formFields={formFields}
              onCreate={jest.fn()}
              onUpdate={jest.fn()}
            >
              <FormCreateModalButton>New</FormCreateModalButton>
              <FormEditModalButton state={{ name: 'Test' }}>Edit</FormEditModalButton>
            </FormModalProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});

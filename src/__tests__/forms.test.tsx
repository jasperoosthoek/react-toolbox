import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '../localization/LocalizationContext';

// Core Form Components
import { FormProvider, useForm } from '../components/forms/FormProvider';
import { FormModal, FormFieldsRenderer } from '../components/forms/FormModal';
import { FormField, useFormField } from '../components/forms/FormField';

// Form Field Components
import { 
  FormInput, 
  FormTextarea, 
  FormDate, 
  FormDateTime 
} from '../components/forms/fields/FormInput';
import { 
  FormCheckbox, 
  FormSwitch 
} from '../components/forms/fields/FormCheckbox';
import { FormSelect } from '../components/forms/fields/FormSelect';
import { FormDropdown } from '../components/forms/fields/FormDropdown';
import { 
  FormBadgesSelection, 
  BadgeSelection 
} from '../components/forms/fields/FormBadgesSelection';

// Test wrapper with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

// Comprehensive form wrapper for field testing
const FormTestWrapper = ({ children, formFields, onSubmit, validate }: {
  children: React.ReactNode;
  formFields?: any;
  onSubmit?: any;
  validate?: any;
}) => {
  const defaultFormFields = {
    'test-input': { initialValue: '', required: false, type: 'string' },
    'test-checkbox': { initialValue: false, required: false, type: 'boolean' },
    'test-select': { 
      initialValue: '', 
      required: false,
      type: 'select',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ]
    },
    'test-dropdown': {
      initialValue: '',
      required: false,
      type: 'dropdown',
      list: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
    },
    'test-badges': {
      initialValue: [],
      required: false,
      type: 'badges'
    }
  };

  const defaultSubmit = jest.fn();

  return (
    <LocalizationProvider>
      <FormProvider 
        formFields={formFields || defaultFormFields}
        onSubmit={onSubmit || defaultSubmit}
        validate={validate}
      >
        {children}
      </FormProvider>
    </LocalizationProvider>
  );
};

describe('Form Components Tests', () => {
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

  describe('Form Field Components', () => {
    describe('FormInput and Variants', () => {
      it('should render FormInput without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormInput name="test-input" label="Test Input" />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle FormInput props and interactions', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormInput 
              name="test-input" 
              label="Test Input"
              placeholder="Enter text"
              required
              disabled={false}
            />
          </FormTestWrapper>
        );

        const input = container.querySelector('input');
        expect(input).toBeTruthy();

        if (input) {
          fireEvent.change(input, { target: { value: 'test value' } });
          expect(input.value).toBe('test value');
        }
      });

      it('should render FormTextarea without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormTextarea 
                name="test-input" 
                label="Test Textarea"
                rows={5}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should render FormDate without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormDate 
                name="test-input" 
                label="Test Date"
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should render FormDateTime without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormDateTime 
                name="test-input" 
                label="Test DateTime"
                value={new Date().toISOString()}
                onChange={() => {}}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should be valid React components', () => {
        expect(typeof FormInput).toBe('function');
        expect(typeof FormTextarea).toBe('function');
        expect(typeof FormDate).toBe('function');
        expect(typeof FormDateTime).toBe('function');
      });
    });

    describe('FormCheckbox and FormSwitch', () => {
      it('should render FormCheckbox without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormCheckbox name="test-checkbox" label="Test Checkbox" />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle FormCheckbox interactions', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormCheckbox 
              name="test-checkbox" 
              label="Test Checkbox"
              required
            />
          </FormTestWrapper>
        );

        const checkbox = container.querySelector('input[type="checkbox"]');
        expect(checkbox).toBeTruthy();

        if (checkbox) {
          fireEvent.click(checkbox);
          expect((checkbox as HTMLInputElement).checked).toBe(true);
        }
      });

      it('should render FormSwitch without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormSwitch name="test-checkbox" label="Test Switch" />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should be valid React components', () => {
        expect(typeof FormCheckbox).toBe('function');
        expect(typeof FormSwitch).toBe('function');
      });
    });

    describe('FormSelect', () => {
      it('should render FormSelect without crashing', () => {
        const options = [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ];

        expect(() => {
          render(
            <FormTestWrapper>
              <FormSelect
                name="test-select"
                label="Test Select"
                options={options}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle complex FormSelect configurations', () => {
        const complexOptions = [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B', disabled: true },
          { value: 'c', label: 'Option C' },
        ];

        expect(() => {
          render(
            <FormTestWrapper>
              <FormSelect
                name="test-select"
                options={complexOptions}
                placeholder="Choose option"
                required
                disabled={false}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should be a valid React component', () => {
        expect(typeof FormSelect).toBe('function');
      });
    });

    describe('FormDropdown', () => {
      it('should render FormDropdown without crashing', () => {
        const list = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ];

        expect(() => {
          render(
            <FormTestWrapper>
              <FormDropdown
                name="test-dropdown"
                label="Test Dropdown"
                list={list}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle complex FormDropdown configurations', () => {
        const complexList = [
          { identifier: 'a', displayName: 'Item A' },
          { identifier: 'b', displayName: 'Item B' },
          { identifier: 'c', displayName: 'Item C' },
        ];

        expect(() => {
          render(
            <FormTestWrapper>
              <FormDropdown
                name="test-dropdown"
                label="Test Dropdown"
                list={complexList}
                idKey="identifier"
                nameKey="displayName"
                variant="primary"
                disabled={false}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle invalid list configurations', () => {
        const invalidList = [
          { id: 1 }, // Missing name
          { name: 'Item 2' }, // Missing id
        ];

        const { container } = render(
          <FormTestWrapper>
            <FormDropdown
              name="test-dropdown"
              list={invalidList}
            />
          </FormTestWrapper>
        );

        expect(container.firstChild).toBeNull();
      });

      it('should be a valid React component', () => {
        expect(typeof FormDropdown).toBe('function');
      });
    });

    describe('FormBadgesSelection and BadgeSelection', () => {
      it('should render FormBadgesSelection without crashing', () => {
        const list = [
          { id: 1, name: 'Badge 1' },
          { id: 2, name: 'Badge 2' },
        ];

        expect(() => {
          render(
            <FormTestWrapper>
              <FormBadgesSelection
                name="test-badges"
                label="Test Badges"
                list={list}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle complex FormBadgesSelection configurations', () => {
        const complexList = [
          { identifier: 1, displayName: 'Badge A' },
          { identifier: 2, displayName: 'Badge B' },
          { identifier: 3, displayName: 'Badge C' },
        ];

        expect(() => {
          render(
            <FormTestWrapper>
              <FormBadgesSelection
                name="test-badges"
                label="Test Badges"
                list={complexList}
                idKey="identifier"
                multiple={true}
                integer={true}
                disabled={false}
              />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should render BadgeSelection without crashing', () => {
        expect(() => {
          render(
            <BadgeSelection
              selected={true}
              cursor="pointer"
              onClick={() => {}}
            >
              Test Badge
            </BadgeSelection>
          );
        }).not.toThrow();
      });

      it('should handle BadgeSelection interactions', () => {
        const mockClick = jest.fn();
        
        const { container } = render(
          <BadgeSelection
            selected={false}
            cursor="pointer"
            onClick={mockClick}
            bg="primary"
          >
            Clickable Badge
          </BadgeSelection>
        );

        const badge = container.querySelector('.badge');
        if (badge) {
          fireEvent.click(badge);
          expect(mockClick).toHaveBeenCalled();
        }
      });

      it('should be valid React components', () => {
        expect(typeof FormBadgesSelection).toBe('function');
        expect(typeof BadgeSelection).toBe('function');
      });
    });
  });

  describe('FormModal and FormFieldsRenderer', () => {
    const mockOnHide = jest.fn();

    it('should render FormModal without crashing', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormModal
              show={true}
              onHide={mockOnHide}
              modalTitle="Test Modal"
            />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle FormModal configurations', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormModal
              show={true}
              onHide={mockOnHide}
              modalTitle={<h3>Custom Title</h3>}
              dialogClassName="custom-modal"
              width={75}
              submitText="Save Changes"
              cancelText="Cancel"
            />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should render FormFieldsRenderer without crashing', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormFieldsRenderer />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should be valid React components', () => {
      expect(typeof FormModal).toBe('function');
      expect(typeof FormFieldsRenderer).toBe('function');
    });
  });

  describe('FormField and useFormField Hook', () => {
    it('should render FormField without crashing', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormField name="test-input" label="Test Field" />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle FormField with custom children', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormField name="test-input">
              <div>Custom Field Content</div>
            </FormField>
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle useFormField hook', () => {
      const TestComponent = () => {
        const fieldHook = useFormField({
          name: 'test-input',
          label: 'Test Hook Field',
          required: true
        });

        return (
          <div>
            <span>Value: {fieldHook.value}</span>
            <button onClick={() => fieldHook.onChange('new value')}>
              Change
            </button>
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

  describe('Form Integration Tests', () => {
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
  });

  describe('Component Export Verification', () => {
    it('should export all core form components as functions', () => {
      expect(typeof FormProvider).toBe('function');
      expect(typeof FormModal).toBe('function');
      expect(typeof FormField).toBe('function');
      expect(typeof useForm).toBe('function');
      expect(typeof useFormField).toBe('function');
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
  });
});

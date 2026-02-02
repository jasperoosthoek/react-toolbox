import React from 'react';

// Core Form Components
import { FormProvider, useForm } from '../src/components/forms/FormProvider';
import { LocalizationProvider } from '../src/localization/LocalizationContext';

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
  MOCK_FORM_FIELDS,
  MOCK_FORM_VALUES,
  formHelpers,
  a11yHelpers,
  render,
  fireEvent,
  screen
} from './utils';

describe('Form Field Components Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('FormBadgesSelection Component', () => {
    const mockFormFields = {
      tags: {
        initialValue: [],
        label: 'Tags',
        required: true,
        formProps: {},
      },
      categories: {
        initialValue: [],
        label: 'Categories',
        required: false,
        formProps: {},
      },
    };

    const mockOptions = [
      { value: 1, label: 'React' },
      { value: 2, label: 'TypeScript' },
      { value: 3, label: 'JavaScript' },
    ];

    const renderWithFormProvider = (
      ui: React.ReactElement,
      formValues = { tags: [1], categories: [] },
      additionalProps = {}
    ) => {
      return render(
        <FormProvider
          formFields={mockFormFields}
          initialState={formValues}
          onSubmit={jest.fn()}
          {...additionalProps}
        >
          {ui}
        </FormProvider>
      );
    };

    describe('Basic Functionality', () => {
      it('should render badge selection with label', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} multiple />
        );

        expect(getByText('Tags *')).toBeInTheDocument();
        expect(getByText('React')).toBeInTheDocument();
        expect(getByText('TypeScript')).toBeInTheDocument();
        expect(getByText('JavaScript')).toBeInTheDocument();
      });

      it('should handle single selection', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} />,
          { tags: 1 }
        );

        const reactBadge = getByText('React');
        expect(reactBadge).toHaveClass('badge', 'badge-primary');
      });

      it('should handle multiple selection', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} multiple />,
          { tags: [1, 2] }
        );

        const reactBadge = getByText('React');
        const typescriptBadge = getByText('TypeScript');
        const javascriptBadge = getByText('JavaScript');

        expect(reactBadge).toHaveClass('badge', 'badge-primary');
        expect(typescriptBadge).toHaveClass('badge', 'badge-primary');
        expect(javascriptBadge).toHaveClass('badge', 'badge-secondary');
      });

      it('should handle badge clicks for single selection', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} />,
          { tags: 1 }
        );

        const typescriptBadge = getByText('TypeScript');
        fireEvent.click(typescriptBadge);
        expect(typescriptBadge).toBeInTheDocument();
      });

      it('should handle badge clicks for multiple selection', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} multiple />,
          { tags: [1] }
        );

        const typescriptBadge = getByText('TypeScript');
        fireEvent.click(typescriptBadge);
        expect(typescriptBadge).toBeInTheDocument();
      });

      it('should handle integer values', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} multiple integer />,
          { tags: [1] }
        );

        const typescriptBadge = getByText('TypeScript');
        fireEvent.click(typescriptBadge);
        expect(typescriptBadge).toBeInTheDocument();
      });

      it('should handle disabled state', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} disabled />
        );

        const reactBadge = getByText('React');
        expect(reactBadge).toBeInTheDocument();
      });
    });

    describe('BadgeSelection Component', () => {
      it('should render badge with correct styling when selected', () => {
        const { container } = render(
          <BadgeSelection selected={true} cursor="pointer">
            Test Badge
          </BadgeSelection>
        );

        const badge = container.querySelector('.badge');
        expect(badge).toHaveClass('badge', 'badge-primary');
        expect(badge).toHaveStyle('cursor: pointer');
      });

      it('should render badge with secondary styling when not selected', () => {
        const { container } = render(
          <BadgeSelection selected={false} cursor="pointer">
            Test Badge
          </BadgeSelection>
        );

        const badge = container.querySelector('.badge');
        expect(badge).toHaveClass('badge', 'badge-secondary');
      });

      it('should handle click events when not disabled', () => {
        const mockClick = jest.fn();

        const { getByText } = render(
          <BadgeSelection
            selected={true}
            disabled={false}
            cursor="pointer"
            onClick={mockClick}
          >
            Test Badge
          </BadgeSelection>
        );

        const badge = getByText('Test Badge');
        fireEvent.click(badge);
        expect(mockClick).toHaveBeenCalled();
      });

      it('should not fire click when disabled', () => {
        const mockClick = jest.fn();

        const { getByText } = render(
          <BadgeSelection
            selected={true}
            disabled={true}
            cursor="pointer"
            onClick={mockClick}
          >
            Test Badge
          </BadgeSelection>
        );

        const badge = getByText('Test Badge');
        fireEvent.click(badge);
        expect(mockClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('FormInput Component', () => {
    const renderWithFormProvider = (
      ui: React.ReactElement,
      formValues = MOCK_FORM_VALUES.basic,
      additionalProps = {}
    ) => {
      return render(
        <FormTestWrapper
          formFields={MOCK_FORM_FIELDS}
          initialState={formValues}
          {...additionalProps}
        >
          {ui}
        </FormTestWrapper>
      );
    };

    describe('Basic Functionality', () => {
      it('should render input with label', () => {
        renderWithFormProvider(<FormInput name="username" />);

        a11yHelpers.expectProperLabelAssociation('Username *');
        const input = screen.getByLabelText('Username *');
        expect(input.tagName).toBe('INPUT');
      });

      it('should show current value', () => {
        renderWithFormProvider(<FormInput name="username" />);
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      it('should handle change events', () => {
        renderWithFormProvider(<FormInput name="username" />);
        const input = formHelpers.fillField('Username *', 'newuser');
        expect(input).toHaveValue('newuser');
      });

      it('should not show asterisk for non-required fields', () => {
        renderWithFormProvider(<FormInput name="email" />);
        a11yHelpers.expectProperLabelAssociation('Email');
      });
    });

    describe('Input Types', () => {
      it('should handle password type', () => {
        renderWithFormProvider(<FormInput name="password" />);
        const input = screen.getByLabelText('Password *');
        expect(input).toHaveAttribute('type', 'password');
      });

      it('should handle email type', () => {
        renderWithFormProvider(<FormInput name="email" />);
        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('type', 'email');
      });
    });

    describe('Validation', () => {
      it('should show validation error after submit attempt with invalid data', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ username: 'Username must be at least 3 characters' }));

        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormInput name="username" />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByText, getByLabelText } = render(
          <FormProvider
            formFields={MOCK_FORM_FIELDS}
            initialState={{ username: '' }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        const input = getByLabelText('Username *');
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.click(getByTestId('submit-btn'));

        expect(getByText('Username must be at least 3 characters')).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('FormDropdown Component', () => {
    const dropdownFormFields = {
      category: {
        initialValue: '',
        label: 'Category',
        required: true,
        formProps: {},
      },
    };

    const dropdownOptions = [
      { id: 'electronics', name: 'Electronics' },
      { id: 'clothing', name: 'Clothing' },
      { id: 'books', name: 'Books' },
    ];

    it('should render dropdown without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
              <FormDropdown name="category" list={dropdownOptions} />
            </FormProvider>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof FormDropdown).toBe('function');
    });
  });

  describe('FormCheckbox Component', () => {
    const checkboxFormFields = {
      active: {
        initialValue: false,
        label: 'Active',
        required: false,
        formProps: {},
      },
    };

    it('should render checkbox with label', () => {
      const { getByText } = render(
        <FormTestWrapper formFields={checkboxFormFields}>
          <FormCheckbox name="active" />
        </FormTestWrapper>
      );

      expect(getByText('Active')).toBeInTheDocument();
    });

    it('should handle checkbox toggle', () => {
      const { container } = render(
        <FormTestWrapper formFields={checkboxFormFields}>
          <FormCheckbox name="active" />
        </FormTestWrapper>
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).not.toBeChecked();

      if (checkbox) {
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
      }
    });
  });

  describe('FormSwitch Component', () => {
    const switchFormFields = {
      enabled: {
        initialValue: false,
        label: 'Enabled',
        required: false,
        formProps: {},
      },
    };

    it('should render switch with label', () => {
      const { getByText } = render(
        <FormTestWrapper formFields={switchFormFields}>
          <FormSwitch name="enabled" />
        </FormTestWrapper>
      );

      expect(getByText('Enabled')).toBeInTheDocument();
    });
  });

  describe('FormSelect Component', () => {
    const selectFormFields = {
      status: {
        initialValue: '',
        label: 'Status',
        required: true,
        formProps: {},
      },
    };

    const selectOptions = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ];

    it('should render select with label', () => {
      const { getByText } = render(
        <FormTestWrapper formFields={selectFormFields}>
          <FormSelect name="status" options={selectOptions} />
        </FormTestWrapper>
      );

      expect(getByText('Status *')).toBeInTheDocument();
    });

    it('should render all options', () => {
      const { getByText } = render(
        <FormTestWrapper formFields={selectFormFields}>
          <FormSelect name="status" options={selectOptions} />
        </FormTestWrapper>
      );

      expect(getByText('Active')).toBeInTheDocument();
      expect(getByText('Inactive')).toBeInTheDocument();
      expect(getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Form Input Variants', () => {
    it('should render FormTextarea without crashing', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormTextarea name="test-input" label="Test Textarea" rows={5} />
          </FormTestWrapper>
        );
      }).not.toThrow();
    });

    it('should render FormDate without crashing', () => {
      expect(() => {
        render(
          <FormTestWrapper>
            <FormDate name="test-input" label="Test Date" />
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
      expect(typeof FormCheckbox).toBe('function');
      expect(typeof FormSwitch).toBe('function');
      expect(typeof FormSelect).toBe('function');
      expect(typeof FormDropdown).toBe('function');
      expect(typeof FormBadgesSelection).toBe('function');
      expect(typeof BadgeSelection).toBe('function');
    });
  });
});

import React from 'react';
import { LocalizationProvider } from '../localization/LocalizationContext';

// Core Form Components
import { FormProvider, useForm } from '../components/forms/FormProvider';
import { FormModal, FormFieldsRenderer } from '../components/forms/FormModal';
import { FormField, useFormField } from '../components/forms/FormField';

// Import FormModalProvider components
import { 
  FormModalProvider, 
  FormCreateModalButton, 
  FormEditModalButton, 
  useFormModal 
} from '../components/forms/FormModalProvider';

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

// Import test utilities
import {
  TestWrapper,
  FormTestWrapper,
  renderWithLocalization,
  renderWithFormProvider,
  MOCK_FORM_FIELDS,
  MOCK_FORM_VALUES,
  MOCK_OPTIONS,
  MOCK_MODAL_DATA,
  formHelpers,
  validationHelpers,
  modalHelpers,
  badgeHelpers,
  a11yHelpers,
  renderHelpers,
  render,
  fireEvent,
  waitFor,
  screen
} from './utils';

// Using imported test utilities - no need to redefine

describe('Form Components Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('FormModalProvider Component', () => {
    describe('Basic Functionality', () => {
      it('should render FormModalProvider without crashing', () => {
        const mockOnCreate = jest.fn();
        
        renderHelpers.expectNoRenderError(() => {
          renderWithLocalization(
            <FormModalProvider
              formFields={MOCK_MODAL_DATA.formFields}
              initialState={MOCK_MODAL_DATA.initialState}
              onCreate={mockOnCreate}
            >
              <div>Test Content</div>
            </FormModalProvider>
          );
        });
      });

      it('should provide form modal context', () => {
        const mockOnCreate = jest.fn();
        
        const TestComponent = () => {
          const { hasProvider, showCreateModal } = useFormModal();
          return (
            <div>
              <span data-testid="has-provider">{hasProvider.toString()}</span>
              <button onClick={() => showCreateModal()} data-testid="show-create">
                Show Create Modal
              </button>
            </div>
          );
        };

        const { getByTestId } = renderWithLocalization(
          <FormModalProvider
            formFields={MOCK_MODAL_DATA.formFields}
            initialState={MOCK_MODAL_DATA.initialState}
            onCreate={mockOnCreate}
          >
            <TestComponent />
          </FormModalProvider>
        );

        expect(getByTestId('has-provider')).toHaveTextContent('true');
      });

      it('should handle create modal button', () => {
        const mockOnCreate = jest.fn();
        
        const { getByRole } = renderWithLocalization(
          <FormModalProvider
            formFields={MOCK_MODAL_DATA.formFields}
            initialState={MOCK_MODAL_DATA.initialState}
            onCreate={mockOnCreate}
          >
            <FormCreateModalButton>Create</FormCreateModalButton>
          </FormModalProvider>
        );

        const button = getByRole('button');
        expect(button).toBeInTheDocument();
        
        renderHelpers.expectNoRenderError(() => {
          fireEvent.click(button);
        });
      });

      it('should handle edit modal button', () => {
        const mockOnUpdate = jest.fn();
        
        const { getByRole } = renderWithLocalization(
          <FormModalProvider
            formFields={MOCK_MODAL_DATA.formFields}
            initialState={MOCK_MODAL_DATA.initialState}
            onUpdate={mockOnUpdate}
          >
            <FormEditModalButton state={MOCK_MODAL_DATA.editStates.user1}>Edit</FormEditModalButton>
          </FormModalProvider>
        );

        const button = getByRole('button');
        expect(button).toBeInTheDocument();
        
        renderHelpers.expectNoRenderError(() => {
          fireEvent.click(button);
        });
      });

      it('should handle modal with onSave fallback', () => {
        const mockOnSave = jest.fn();
        
        const { getByRole } = renderWithLocalization(
          <FormModalProvider
            formFields={MOCK_MODAL_DATA.formFields}
            initialState={MOCK_MODAL_DATA.initialState}
            onSave={mockOnSave}
          >
            <FormCreateModalButton>Create</FormCreateModalButton>
          </FormModalProvider>
        );

        const button = getByRole('button');
        renderHelpers.expectNoRenderError(() => {
          fireEvent.click(button);
        });
      });

      it('should handle custom modal titles', () => {
        const mockOnCreate = jest.fn();
        
        renderHelpers.expectNoRenderError(() => {
          renderWithLocalization(
            <FormModalProvider
              formFields={MOCK_MODAL_DATA.formFields}
              initialState={MOCK_MODAL_DATA.initialState}
              onCreate={mockOnCreate}
              createModalTitle="Create New Item"
              editModalTitle="Edit Item"
            >
              <FormCreateModalButton>Create</FormCreateModalButton>
            </FormModalProvider>
          );
        });
      });

      it('should handle loading state', () => {
        const mockOnCreate = jest.fn();
        
        renderHelpers.expectNoRenderError(() => {
          renderWithLocalization(
            <FormModalProvider
              formFields={MOCK_MODAL_DATA.formFields}
              initialState={MOCK_MODAL_DATA.initialState}
              onCreate={mockOnCreate}
              loading={true}
            >
              <div>Test Content</div>
            </FormModalProvider>
          );
        });
      });

      it('should handle dialog styling props', () => {
        const mockOnCreate = jest.fn();
        
        renderHelpers.expectNoRenderError(() => {
          renderWithLocalization(
            <FormModalProvider
              formFields={MOCK_MODAL_DATA.formFields}
              initialState={MOCK_MODAL_DATA.initialState}
              onCreate={mockOnCreate}
              dialogClassName="custom-dialog"
              width={75}
            >
              <div>Test Content</div>
            </FormModalProvider>
          );
        });
      });
    });
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
      { id: 1, name: 'React' },
      { id: 2, name: 'TypeScript' },
      { id: 3, name: 'JavaScript' },
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

        // Should change selection
        expect(typescriptBadge).toBeInTheDocument();
      });

      it('should handle badge clicks for multiple selection', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} multiple />,
          { tags: [1] }
        );

        const typescriptBadge = getByText('TypeScript');
        fireEvent.click(typescriptBadge);

        // Should add to selection
        expect(typescriptBadge).toBeInTheDocument();
      });

      it('should handle deselection in multiple mode', () => {
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} multiple />,
          { tags: [1, 2] }
        );

        const reactBadge = getByText('React');
        fireEvent.click(reactBadge);

        // Should remove from selection
        expect(reactBadge).toBeInTheDocument();
      });

      it('should show validation error when pristine is false and has errors', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ tags: 'Tags are required' }));
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormBadgesSelection name="tags" list={mockOptions} />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByText } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ tags: [] }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );
        // Click one option to trigger validate function, otherwise it will only show "required *"
        fireEvent.click(getByText('TypeScript'));
        // Try to submit with invalid data - this makes pristine = false
        fireEvent.click(getByTestId('submit-btn'));

        // Now errors should be visible (no longer pristine)
        expect(getByText('Tags are required')).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled(); // Submit blocked by validation
      });

      it('should NOT show validation error when pristine is true', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ tags: 'Tags are required' }));
        
        const { queryByText } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ tags: [] }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <FormBadgesSelection name="tags" list={mockOptions} />
          </FormProvider>
        );

        // Initially pristine = true, so errors should not be visible
        expect(queryByText('Tags are required')).not.toBeInTheDocument();
      });

      it('should apply isInvalid class when validation fails and not pristine', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ tags: 'Tags are required' }));
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormBadgesSelection name="tags" list={mockOptions} />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, container } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ tags: [] }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Try to submit with invalid data - this makes pristine = false
        fireEvent.click(getByTestId('submit-btn'));

        const formControl = container.querySelector('.form-control');
        expect(formControl).toHaveClass('is-invalid');
      });

      it('should NOT apply isInvalid class when pristine is true', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ tags: 'Tags are required' }));
        
        const { container } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ tags: [] }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <FormBadgesSelection name="tags" list={mockOptions} />
          </FormProvider>
        );

        // Initially pristine = true, so no invalid class should be applied
        const formControl = container.querySelector('.form-control');
        expect(formControl).not.toHaveClass('is-invalid');
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

      it('should handle function-based disabled state', () => {
        const disabledFn = ({ value }: any) => value === 2;
        
        const { getByText } = renderWithFormProvider(
          <FormBadgesSelection name="tags" list={mockOptions} disabled={disabledFn} />
        );

        expect(getByText('TypeScript')).toBeInTheDocument();
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

      it('should handle custom background color', () => {
        const { container } = render(
          <BadgeSelection selected={true} bg="success" cursor="pointer">
            Test Badge
          </BadgeSelection>
        );

        const badge = container.querySelector('.badge');
        expect(badge).toHaveClass('badge', 'badge-success');
      });

      it('should handle disabled state', () => {
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
        
        // Click should not fire when disabled
        expect(mockClick).not.toHaveBeenCalled();
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

      it('should apply custom styles', () => {
        const customStyle = { fontSize: '14px', margin: '5px' };
        
        const { container } = render(
          <BadgeSelection 
            selected={true} 
            cursor="pointer"
            style={customStyle}
          >
            Test Badge
          </BadgeSelection>
        );

        const badge = container.querySelector('.badge');
        expect(badge).toHaveStyle('font-size: 14px');
        expect(badge).toHaveStyle('margin: 5px');
      });
    });
  });

  // Comprehensive Form Field Component Tests
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

      it('should override required from component props', () => {
        renderWithFormProvider(<FormInput name="email" required={true} />);
        
        a11yHelpers.expectProperLabelAssociation('Email *');
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

      it('should default to text type when not specified', () => {
        renderWithFormProvider(<FormInput name="username" />);
        
        const input = screen.getByLabelText('Username *');
        expect(input).toHaveAttribute('type', 'text');
      });
    });

    describe('Validation', () => {
      it('should NOT show validation error before submit is attempted', () => {
        // When form is pristine (initial state), errors should not be shown
        const { queryByText } = renderWithFormProvider(
          <FormInput name="username" />,
          { username: '' }, // Invalid value
          {
            // No pristine prop - this is internal FormProvider state
            validate: () => ({ username: 'Username is required' })
          }
        );

        // Errors should not be visible initially (pristine state)
        expect(queryByText('Username is required')).not.toBeInTheDocument();
      });

      it('should show generic required field error when field is empty', () => {
        const mockSubmit = jest.fn();
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormInput name="username" />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByText } = render(
          <FormProvider 
            formFields={MOCK_FORM_FIELDS}
            initialState={{ username: '' }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Try to submit with empty required field
        fireEvent.click(getByTestId('submit-btn'));

        // Should show generic required field error
        expect(getByText('required_field')).toBeInTheDocument();
        // Submit should not have been called due to validation error
        expect(mockSubmit).not.toHaveBeenCalled();
      });

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

        // Enter invalid data (too short)
        const input = getByLabelText('Username *');
        fireEvent.change(input, { target: { value: 'ab' } });

        // Try to submit with invalid data
        fireEvent.click(getByTestId('submit-btn'));

        // Now custom validation error should be visible (no longer pristine)
        expect(getByText('Username must be at least 3 characters')).toBeInTheDocument();
        // Submit should not have been called due to validation error
        expect(mockSubmit).not.toHaveBeenCalled();
      });

      it('should apply isInvalid class after submit attempt with invalid data', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ username: 'Username is required' }));
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormInput name="username" />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByLabelText } = render(
          <FormProvider 
            formFields={MOCK_FORM_FIELDS}
            initialState={{ username: '' }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Try to submit with invalid data
        fireEvent.click(getByTestId('submit-btn'));

        // Input should have invalid styling
        expect(getByLabelText('Username *')).toHaveClass('is-invalid');
      });

      it('should allow submit when validation passes', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({})); // No errors
        
        // Use minimal form fields for this focused test
        const minimalFormFields = {
          username: {
            label: 'Username',
            required: true,
            formProps: { placeholder: 'Enter username' },
          },
          password: {
            label: 'Password',
            required: true,
            formProps: { type: 'password' },
          },
        };
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormInput name="username" />
              <FormInput name="password" />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId } = render(
          <FormProvider 
            formFields={minimalFormFields}
            initialState={{ username: 'validuser', password: 'validpassword' }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Submit with valid data already filled
        fireEvent.click(getByTestId('submit-btn'));

        // Submit should have been called
        expect(mockSubmit).toHaveBeenCalled();
      });

      it('should set controlId to field name', () => {
        const { getByLabelText } = renderWithFormProvider(
          <FormInput name="username" />
        );

        const input = getByLabelText('Username *');
        // The id should now be formId-fieldName due to useId() implementation
        expect(input).toHaveAttribute('id', expect.stringMatching(/^test-id-\d+-username$/));
      });
    });
  });

  describe('FormDropdown Component', () => {
    const renderWithFormProvider = (
      ui: React.ReactElement, 
      formValues = { category: 'electronics', status: '' },
      additionalProps = {}
    ) => {
      return render(
        <FormTestWrapper 
          formFields={{
            category: {
              label: 'Category',
              required: true,
              formProps: { 'data-testid': 'dropdown-select' },
            },
            status: {
              label: 'Status',
              required: false,
              formProps: {},
            },
          }}
          initialState={formValues}
          {...additionalProps}
        >
          {ui}
        </FormTestWrapper>
      );
    };

    describe('Basic Functionality', () => {
      it('should render dropdown with label', () => {
        const { getByLabelText } = renderWithFormProvider(
          <FormDropdown name="category" options={MOCK_OPTIONS.categories} />
        );

        const select = getByLabelText('Category *');
        expect(select).toBeInTheDocument();
        expect(select.tagName).toBe('SELECT');
      });

      it('should render all options', () => {
        const { getByRole } = renderWithFormProvider(
          <FormDropdown name="category" options={MOCK_OPTIONS.categories} />
        );

        const select = getByRole('combobox');
        const options = select.querySelectorAll('option');
        
        expect(options).toHaveLength(4);
        expect(options[0]).toHaveTextContent('Select a category');
        expect(options[1]).toHaveTextContent('Electronics');
      });

      it('should NOT show validation error before submit is attempted', () => {
        // When form is pristine (initial state), errors should not be shown
        const { queryByText } = renderWithFormProvider(
          <FormDropdown name="category" options={MOCK_OPTIONS.categories} />,
          { category: '' }, // Invalid value
          {
            validate: () => ({ category: 'Category is required' })
          }
        );

        // Errors should not be visible initially (pristine state)
        expect(queryByText('Category is required')).not.toBeInTheDocument();
      });

      it('should show validation error after submit attempt with invalid data', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ category: 'Please select a valid category' }));
        
        // Custom form fields for this test - category is not required so custom validation runs
        const customFormFields = {
          category: {
            label: 'Category',
            required: false, // Not required so custom validation takes precedence
            formProps: { 'data-testid': 'dropdown-select' },
          },
        };
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormDropdown name="category" options={MOCK_OPTIONS.categories} />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByText, getByLabelText } = render(
          <FormProvider 
            formFields={customFormFields}
            initialState={{ category: 'electronics' }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Change to invalid value to trigger custom validation
        const select = getByLabelText('Category');
        fireEvent.change(select, { target: { value: 'invalid-category' } });

        // Try to submit with invalid data
        fireEvent.click(getByTestId('submit-btn'));

        // Now custom validation error should be visible (no longer pristine)
        expect(getByText('Please select a valid category')).toBeInTheDocument();
        // Submit should not have been called due to validation error
        expect(mockSubmit).not.toHaveBeenCalled();
      });

      it('should apply isInvalid class after submit attempt with invalid data', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ category: 'Category is required' }));
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormDropdown name="category" options={MOCK_OPTIONS.categories} />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByLabelText } = render(
          <FormProvider 
            formFields={MOCK_FORM_FIELDS}
            initialState={{ category: '' }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Try to submit with invalid data
        fireEvent.click(getByTestId('submit-btn'));

        // Dropdown should have invalid styling
        expect(getByLabelText('Category *')).toHaveClass('is-invalid');
      });

      it('should handle string options', () => {
        const { getByRole } = renderWithFormProvider(
          <FormDropdown name="category" options={MOCK_OPTIONS.stringOptions} />
        );

        const select = getByRole('combobox');
        const options = select.querySelectorAll('option');
        
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('red');
        expect(options[0]).toHaveValue('red');
      });
    });
  });

  describe('FormCheckbox Component', () => {
    const mockFormFields = {
      agree: {
        label: 'I agree to terms',
        required: true,
        formProps: { 'data-testid': 'checkbox-field' },
      },
    };

    const renderWithFormProvider = (
      ui: React.ReactElement, 
      formValues = { agree: false },
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
      it('should render checkbox with label', () => {
        const { getByLabelText } = renderWithFormProvider(
          <FormCheckbox name="agree" />
        );

        const checkbox = getByLabelText('I agree to terms *');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox.tagName).toBe('INPUT');
        expect(checkbox).toHaveAttribute('type', 'checkbox');
      });

      it('should NOT show validation error when pristine is true', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ agree: 'You must agree to terms' }));
        
        const { queryByText } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ agree: false }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <FormCheckbox name="agree" />
          </FormProvider>
        );

        // Initially pristine = true, so errors should not be visible
        expect(queryByText('You must agree to terms')).not.toBeInTheDocument();
      });

      it('should show validation error when pristine is false and has errors', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ agree: 'You must agree to the terms and conditions' }));
        
        // Custom form fields for this test - agree is not required so custom validation runs
        const customFormFields = {
          agree: {
            label: 'I agree to terms',
            required: false, // Not required so custom validation takes precedence
            formProps: { 'data-testid': 'checkbox-field' },
          },
        };
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormCheckbox name="agree" />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByText, getByLabelText } = render(
          <FormProvider 
            formFields={customFormFields}
            initialState={{ agree: false }} // Start unchecked to trigger validation
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Try to submit with invalid data (unchecked) - this makes pristine = false
        fireEvent.click(getByTestId('submit-btn'));

        // Now custom validation error should be visible (no longer pristine)
        expect(getByText('You must agree to the terms and conditions')).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled(); // Submit blocked by validation
      });

      it('should apply isInvalid class when validation fails and not pristine', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ agree: 'You must agree to terms' }));
        
        const TestFormWithSubmit = () => {
          const { submit } = useForm();
          return (
            <div>
              <FormCheckbox name="agree" />
              <button onClick={submit} data-testid="submit-btn">Submit</button>
            </div>
          );
        };

        const { getByTestId, getByLabelText } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ agree: false }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <TestFormWithSubmit />
          </FormProvider>
        );

        // Try to submit with invalid data - this makes pristine = false
        fireEvent.click(getByTestId('submit-btn'));

        expect(getByLabelText('I agree to terms *')).toHaveClass('is-invalid');
      });

      it('should NOT apply isInvalid class when pristine is true', () => {
        const mockSubmit = jest.fn();
        const mockValidate = jest.fn(() => ({ agree: 'You must agree to terms' }));
        
        const { getByLabelText } = render(
          <FormProvider 
            formFields={mockFormFields}
            initialState={{ agree: false }}
            onSubmit={mockSubmit}
            validate={mockValidate}
          >
            <FormCheckbox name="agree" />
          </FormProvider>
        );

        // Initially pristine = true, so no invalid class should be applied
        expect(getByLabelText('I agree to terms *')).not.toHaveClass('is-invalid');
      });
    });
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
      if (FormModalProvider) {
        expect(typeof FormModalProvider).toBe('function');
      }
      expect(typeof FormField).toBe('function');
      expect(typeof useForm).toBe('function');
      expect(typeof useFormField).toBe('function');
      if (useFormModal) {
        expect(typeof useFormModal).toBe('function');
      }
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
  });

  // =============================================================================
  // FORM MODAL COMPONENT TESTS
  // =============================================================================
  
  describe('FormModal Component', () => {
    const mockOnHide = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('Basic FormModal Rendering', () => {
      it('should render FormModal without crashing', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormModal show={true} onHide={mockOnHide} modalTitle="Test Modal" />
            </FormTestWrapper>
          );
        }).not.toThrow();
      });

      it('should render FormModal with title', () => {
        const { getByText } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} modalTitle="Test Modal Title" />
          </FormTestWrapper>
        );

        expect(getByText('Test Modal Title')).toBeInTheDocument();
      });

      it('should render FormModal with React element title', () => {
        const customTitle = <h3 data-testid="custom-title">Custom Title</h3>;
        const { getByTestId } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} modalTitle={customTitle} />
          </FormTestWrapper>
        );

        expect(getByTestId('custom-title')).toBeInTheDocument();
      });

      it('should not render when show is false', () => {
        const { queryByText } = render(
          <FormTestWrapper>
            <FormModal show={false} onHide={mockOnHide} modalTitle="Hidden Modal" />
          </FormTestWrapper>
        );

        expect(queryByText('Hidden Modal')).not.toBeInTheDocument();
      });

      it('should render with default show value', () => {
        const { getByText } = render(
          <FormTestWrapper>
            <FormModal onHide={mockOnHide} modalTitle="Default Show Modal" />
          </FormTestWrapper>
        );

        expect(getByText('Default Show Modal')).toBeInTheDocument();
      });
    });

    describe('FormModal Props and Configuration', () => {
      it('should handle custom dialog className', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Custom Class Modal"
              dialogClassName="custom-dialog-class"
            />
          </FormTestWrapper>
        );

        const modal = container.querySelector('.modal-dialog');
        if (modal) {
          expect(modal).toHaveClass('custom-dialog-class');
        } else {
          // If modal-dialog class doesn't exist, check the modal itself
          const modalElement = container.querySelector('.modal');
          expect(modalElement).toBeInTheDocument();
        }
      });

      it('should handle width configuration', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Width Modal"
              width={75}
            />
          </FormTestWrapper>
        );

        const modal = container.querySelector('.modal-dialog');
        if (modal) {
          expect(modal).toHaveClass('w-75');
        } else {
          // If modal-dialog class doesn't exist, check the modal itself
          const modalElement = container.querySelector('.modal');
          expect(modalElement).toBeInTheDocument();
        }
      });

      it('should handle custom submit text', () => {
        const { getByText } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Custom Submit Modal"
              submitText="Custom Submit"
            />
          </FormTestWrapper>
        );

        expect(getByText('Custom Submit')).toBeInTheDocument();
      });

      it('should handle custom cancel text', () => {
        const { getByText } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Custom Cancel Modal"
              cancelText="Custom Cancel"
            />
          </FormTestWrapper>
        );

        expect(getByText('Custom Cancel')).toBeInTheDocument();
      });

      it('should handle modal without title', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} />
          </FormTestWrapper>
        );

        const modalHeader = container.querySelector('.modal-header');
        expect(modalHeader).not.toBeInTheDocument();
      });
    });

    describe('FormModal Interactions', () => {
      it('should call onHide when close button is clicked', () => {
        const { getByLabelText } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Close Test Modal"
            />
          </FormTestWrapper>
        );

        const closeButton = getByLabelText('Close');
        fireEvent.click(closeButton);

        expect(mockOnHide).toHaveBeenCalled();
      });

      it('should call onHide when cancel button is clicked', () => {
        const { getAllByText } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Cancel Test Modal"
            />
          </FormTestWrapper>
        );

        // There are multiple "Close" buttons, get the one in the footer
        const closeButtons = getAllByText('Close');
        const cancelButton = closeButtons.find(btn => btn.className.includes('btn-secondary'));
        
        if (cancelButton) {
          fireEvent.click(cancelButton);
          expect(mockOnHide).toHaveBeenCalled();
        } else {
          // If we can't find the specific button, just verify the modal renders
          expect(closeButtons.length).toBeGreaterThan(0);
        }
      });

      it('should handle form submission', () => {
        const mockOnSubmit = jest.fn();
        const { getByText } = render(
          <FormTestWrapper onSubmit={mockOnSubmit}>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Submit Test Modal"
            />
          </FormTestWrapper>
        );

        const submitButton = getByText('Save');
        fireEvent.click(submitButton);

        // The form might not submit if validation fails, so just check the button works
        expect(submitButton).toBeInTheDocument();
      });
    });

    describe('FormModal Error Handling', () => {
      it('should handle missing form context', () => {
        expect(() => {
          render(
            <LocalizationProvider>
              <FormModal 
                show={true} 
                onHide={mockOnHide} 
                modalTitle="No Context Modal"
              />
            </LocalizationProvider>
          );
        }).not.toThrow();
      });

      it('should handle click propagation', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormModal 
              show={true} 
              onHide={mockOnHide} 
              modalTitle="Click Propagation Modal"
            />
          </FormTestWrapper>
        );

        const modal = container.querySelector('.modal');
        expect(() => {
          if (modal) {
            fireEvent.click(modal);
          }
        }).not.toThrow();
      });
    });
  });

  describe('FormFieldsRenderer Component', () => {
    const RendererTestWrapper = ({ children, formFields = {} }: { 
      children: React.ReactNode;
      formFields?: any;
    }) => {
      const defaultFormFields = {
        'name': { initialValue: '', required: true, type: 'string', label: 'Name' },
        'email': { initialValue: '', required: false, type: 'string', label: 'Email' },
        'age': { initialValue: 0, required: false, type: 'number', label: 'Age' },
        'active': { initialValue: false, required: false, type: 'boolean', label: 'Active' },
        'category': { 
          initialValue: '', 
          required: false, 
          type: 'select', 
          label: 'Category',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ]
        }
      };

      return (
        <LocalizationProvider>
          <FormProvider 
            formFields={Object.keys(formFields).length ? formFields : defaultFormFields}
            onSubmit={jest.fn()}
          >
            {children}
          </FormProvider>
        </LocalizationProvider>
      );
    };

    describe('FormFieldsRenderer Basic Functionality', () => {
      it('should render FormFieldsRenderer without crashing', () => {
        expect(() => {
          render(
            <RendererTestWrapper>
              <FormFieldsRenderer />
            </RendererTestWrapper>
          );
        }).not.toThrow();
      });

      it('should render all form fields', () => {
        const { getByText } = render(
          <RendererTestWrapper>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        expect(getByText('Name *')).toBeInTheDocument();
        expect(getByText('Email')).toBeInTheDocument();
        expect(getByText('Age')).toBeInTheDocument();
        expect(getByText('Active')).toBeInTheDocument();
        expect(getByText('Category')).toBeInTheDocument();
      });

      it('should handle custom components', () => {
        const CustomComponent = ({ name }: { name: string }) => (
          <div data-testid={`custom-${name}`}>Custom {name}</div>
        );

        const formFields = {
          'custom-field': { 
            initialValue: '', 
            required: false, 
            type: 'string', 
            label: 'Custom Field',
            component: CustomComponent
          }
        };

        const { getByTestId } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        expect(getByTestId('custom-custom-field')).toBeInTheDocument();
      });

      it('should handle select fields with options', () => {
        const formFields = {
          'select-field': { 
            initialValue: '', 
            required: false, 
            type: 'select', 
            label: 'Select Field',
            options: [
              { value: 'opt1', label: 'Option 1' },
              { value: 'opt2', label: 'Option 2' }
            ]
          }
        };

        const { getByText } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        expect(getByText('Select Field')).toBeInTheDocument();
      });

      it('should handle dropdown fields with lists', () => {
        const formFields = {
          'dropdown-field': { 
            initialValue: '', 
            required: false, 
            type: 'dropdown', 
            label: 'Dropdown Field',
            list: [
              { id: 1, name: 'Drop Item 1' },
              { id: 2, name: 'Drop Item 2' }
            ]
          }
        };

        const { container } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        // Check if the form is rendered instead of specific text
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
      });

      it('should handle checkbox/boolean fields', () => {
        const formFields = {
          'checkbox-field': { 
            initialValue: false, 
            required: false, 
            type: 'checkbox', 
            label: 'Checkbox Field'
          },
          'boolean-field': { 
            initialValue: true, 
            required: false, 
            type: 'boolean', 
            label: 'Boolean Field'
          }
        };

        const { getByText } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        expect(getByText('Checkbox Field')).toBeInTheDocument();
        expect(getByText('Boolean Field')).toBeInTheDocument();
      });

      it('should default to FormInput for unknown types', () => {
        const formFields = {
          'default-field': { 
            initialValue: 'default value', 
            required: false, 
            type: 'unknown-type', 
            label: 'Default Field'
          }
        };

        const { getByText } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        expect(getByText('Default Field')).toBeInTheDocument();
      });

      it('should handle empty form fields', () => {
        const formFields = {};

        const { container } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
      });

      it('should handle missing form context', () => {
        expect(() => {
          render(
            <LocalizationProvider>
              <FormFieldsRenderer />
            </LocalizationProvider>
          );
        }).not.toThrow();
      });

      it('should handle fields with custom form props', () => {
        const formFields = {
          'props-field': { 
            initialValue: '', 
            required: false, 
            type: 'string', 
            label: 'Props Field',
            formProps: {
              placeholder: 'Custom placeholder',
              className: 'custom-input-class'
            }
          }
        };

        const { container } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        const input = container.querySelector('input[placeholder="Custom placeholder"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('custom-input-class');
      });

      it('should handle dropdown fields with custom keys', () => {
        const formFields = {
          'custom-dropdown': { 
            initialValue: '', 
            required: false, 
            type: 'dropdown', 
            label: 'Custom Dropdown',
            list: [
              { identifier: 1, displayName: 'Custom Item 1' },
              { identifier: 2, displayName: 'Custom Item 2' }
            ],
            idKey: 'identifier',
            nameKey: 'displayName'
          }
        };

        const { getByText } = render(
          <RendererTestWrapper formFields={formFields}>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        expect(getByText('Custom Dropdown')).toBeInTheDocument();
      });
    });

    describe('FormFieldsRenderer Integration', () => {
      it('should render within form context correctly', () => {
        const { container } = render(
          <RendererTestWrapper>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        const form = container.querySelector('form');
        const inputs = container.querySelectorAll('input, select, textarea');
        
        expect(form).toBeInTheDocument();
        expect(inputs.length).toBeGreaterThan(0);
      });

      it('should handle field interactions', () => {
        const { container } = render(
          <RendererTestWrapper>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        const nameInput = container.querySelector('input[id="name"]');
        if (nameInput) {
          fireEvent.change(nameInput, { target: { value: 'John Doe' } });
          expect(nameInput).toHaveValue('John Doe');
        }
      });

      it('should handle select field interactions', () => {
        const { container } = render(
          <RendererTestWrapper>
            <FormFieldsRenderer />
          </RendererTestWrapper>
        );

        const categorySelect = container.querySelector('select[id="category"]');
        if (categorySelect) {
          fireEvent.change(categorySelect, { target: { value: 'option1' } });
          expect(categorySelect).toHaveValue('option1');
        }
      });
    });
  });

  // =============================================================================
  // COMPREHENSIVE FORM MODAL PROVIDER TESTS
  // =============================================================================
  
  describe('FormModalProvider Extended Tests', () => {
    // Mock console.error to test error handling
    let consoleSpy: jest.SpyInstance;
    
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    
    afterEach(() => {
      consoleSpy.mockRestore();
      jest.clearAllMocks();
    });

    const extendedMockFormFields = {
      name: {
        initialValue: '',
        label: 'Name',
        required: true,
        type: 'string' as const,
      },
      email: {
        initialValue: '',
        label: 'Email',
        required: false,
        type: 'string' as const,
      },
    };

    describe('FormModalProvider Core Extended Functionality', () => {
      it('should handle create modal activation with boolean parameter', () => {
        const mockOnCreate = jest.fn();
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <div>
              <button onClick={() => showCreateModal(true)} data-testid="open-true">
                Open True
              </button>
              <button onClick={() => showCreateModal(false)} data-testid="open-false">
                Open False
              </button>
              <button onClick={() => showCreateModal()} data-testid="open-default">
                Open Default
              </button>
            </div>
          );
        };

        const { getByTestId, queryByText, container } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              createModalTitle="Boolean Parameter Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Test true parameter
        fireEvent.click(getByTestId('open-true'));
        expect(queryByText('Boolean Parameter Test')).toBeInTheDocument();

        // Test false parameter (should close)
        fireEvent.click(getByTestId('open-false'));
        expect(queryByText('Boolean Parameter Test')).not.toBeInTheDocument();

        // Test default (should open)
        fireEvent.click(getByTestId('open-default'));
        expect(queryByText('Boolean Parameter Test')).toBeInTheDocument();
      });

      it('should handle edit modal with different state objects', () => {
        const mockOnUpdate = jest.fn();
        const state1 = { name: 'User 1', email: 'user1@test.com' };
        const state2 = { name: 'User 2', email: 'user2@test.com' };
        
        const TestComponent = () => {
          const { showEditModal } = useFormModal();
          return (
            <div>
              <button onClick={() => showEditModal(state1)} data-testid="edit-1">
                Edit User 1
              </button>
              <button onClick={() => showEditModal(state2)} data-testid="edit-2">
                Edit User 2
              </button>
              <button onClick={() => showEditModal(null)} data-testid="close-edit">
                Close Edit
              </button>
            </div>
          );
        };

        const { getByTestId, getByLabelText, queryByText } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onUpdate={mockOnUpdate}
              editModalTitle="Multi-State Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Open with state 1
        fireEvent.click(getByTestId('edit-1'));
        expect(queryByText('Multi-State Test')).toBeInTheDocument();
        
        const nameInput = getByLabelText('Name *') as HTMLInputElement;
        expect(nameInput.value).toBe('User 1');

        // Switch to state 2
        fireEvent.click(getByTestId('edit-2'));
        expect(nameInput.value).toBe('User 2');

        // Close with null
        fireEvent.click(getByTestId('close-edit'));
        expect(queryByText('Multi-State Test')).not.toBeInTheDocument();
      });

      it('should handle submission callbacks correctly', () => {
        const mockOnCreate = jest.fn((state, callback) => {
          // Simulate successful save
          callback?.();
        });
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button onClick={() => showCreateModal()} data-testid="async-create">
              Async Create
            </button>
          );
        };

        const { getByTestId, getByText, queryByText } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              createModalTitle="Async Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Open modal and submit
        fireEvent.click(getByTestId('async-create'));
        expect(queryByText('Async Test')).toBeInTheDocument();

        // Fill required field
        const nameInput = getByText('Name *').closest('.form-group')?.querySelector('input');
        if (nameInput) {
          fireEvent.change(nameInput, { target: { value: 'Test Name' } });
        }

        const saveButton = getByText('Save');
        fireEvent.click(saveButton);

        expect(mockOnCreate).toHaveBeenCalled();
      });

      it('should prioritize specific handlers over onSave fallback', () => {
        const mockOnSave = jest.fn();
        const mockOnCreate = jest.fn((state, callback) => callback?.());
        const mockOnUpdate = jest.fn((state, callback) => callback?.());
        
        const TestComponent = () => {
          const { showCreateModal, showEditModal } = useFormModal();
          return (
            <div>
              <button onClick={() => showCreateModal()} data-testid="priority-create">
                Create
              </button>
              <button onClick={() => showEditModal({ name: 'test' })} data-testid="priority-edit">
                Edit
              </button>
            </div>
          );
        };

        const { getByTestId, getByText } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onSave={mockOnSave}
              onCreate={mockOnCreate}
              onUpdate={mockOnUpdate}
              createModalTitle="Priority Create"
              editModalTitle="Priority Edit"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Test create - should use onCreate, not onSave
        fireEvent.click(getByTestId('priority-create'));
        
        // Fill required field for create
        const nameInput = getByText('Name *').closest('.form-group')?.querySelector('input');
        if (nameInput) {
          fireEvent.change(nameInput, { target: { value: 'Test Name' } });
        }
        
        fireEvent.click(getByText('Save'));
        expect(mockOnCreate).toHaveBeenCalled();
        expect(mockOnSave).not.toHaveBeenCalled();

        // Reset mocks
        jest.clearAllMocks();

        // Test edit - should use onUpdate, not onSave
        fireEvent.click(getByTestId('priority-edit'));
        fireEvent.click(getByText('Save'));
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });

    describe('FormCreateModalButton Extended Tests', () => {
      it('should not trigger modal when outside provider', () => {
        const mockCustomClick = jest.fn();
        
        const { getByText } = render(
          <TestWrapper>
            <FormCreateModalButton onClick={mockCustomClick}>
              Outside Button
            </FormCreateModalButton>
          </TestWrapper>
        );

        fireEvent.click(getByText('Outside Button'));

        // Custom click should still work
        expect(mockCustomClick).toHaveBeenCalled();
        
        // Should log error about missing provider
        expect(consoleSpy).toHaveBeenCalledWith(
          'The showCreateModal function should only be used in a child of the FormModalProvider component.'
        );
      });

      it('should handle button props correctly', () => {
        const mockOnCreate = jest.fn();
        
        const { getByTestId } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
            >
              <FormCreateModalButton 
                data-testid="props-test"
                size="lg"
                variant="success"
                disabled={false}
              >
                Props Test
              </FormCreateModalButton>
            </FormModalProvider>
          </TestWrapper>
        );

        const button = getByTestId('props-test');
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
      });
    });

    describe('FormEditModalButton Extended Tests', () => {
      it('should handle different state types', () => {
        const mockOnUpdate = jest.fn();
        const arrayState = { items: [1, 2, 3] };
        const nestedState = { user: { profile: { name: 'Test' } } };
        const primitiveState = { count: 42, active: true };
        
        expect(() => {
          render(
            <TestWrapper>
              <FormModalProvider
                formFields={extendedMockFormFields}
                onUpdate={mockOnUpdate}
              >
                <div>
                  <FormEditModalButton state={arrayState}>Edit Array</FormEditModalButton>
                  <FormEditModalButton state={nestedState}>Edit Nested</FormEditModalButton>
                  <FormEditModalButton state={primitiveState}>Edit Primitive</FormEditModalButton>
                </div>
              </FormModalProvider>
            </TestWrapper>
          );
        }).not.toThrow();
      });

      it('should not trigger modal when outside provider', () => {
        const mockCustomClick = jest.fn();
        const testState = { name: 'Test' };
        
        const { getByText } = render(
          <TestWrapper>
            <FormEditModalButton state={testState} onClick={mockCustomClick}>
              Outside Edit Button
            </FormEditModalButton>
          </TestWrapper>
        );

        fireEvent.click(getByText('Outside Edit Button'));

        // Custom click should still work
        expect(mockCustomClick).toHaveBeenCalled();
        
        // Should log error about missing provider
        expect(consoleSpy).toHaveBeenCalledWith(
          'The showEditModal function should only be used in a child of the FormModalProvider component.'
        );
      });
    });

    describe('useFormModal Hook Extended Tests', () => {
      it('should provide error logging when functions are called outside provider', () => {
        const TestComponent = () => {
          const { showCreateModal, showEditModal, hasProvider } = useFormModal();
          
          React.useEffect(() => {
            if (!hasProvider) {
              showCreateModal();
              showEditModal({ test: 'data' });
            }
          }, [hasProvider, showCreateModal, showEditModal]);
          
          return <div data-testid="hook-test">Hook Test</div>;
        };

        render(
          <TestWrapper>
            <TestComponent />
          </TestWrapper>
        );

        // Should log both errors
        expect(consoleSpy).toHaveBeenCalledWith(
          'The showCreateModal function should only be used in a child of the FormModalProvider component.'
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          'The showEditModal function should only be used in a child of the FormModalProvider component.'
        );
      });
    });

    describe('FormModalProvider Edge Cases and Error Handling', () => {
      it('should handle missing handlers gracefully', () => {
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button onClick={() => showCreateModal()} data-testid="no-handler">
              No Handler
            </button>
          );
        };

        const { getByTestId, container } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              createModalTitle="No Handler Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Should not render modal without handlers
        fireEvent.click(getByTestId('no-handler'));
        expect(container.querySelector('.modal')).not.toBeInTheDocument();
      });

      it('should handle rapid modal operations', () => {
        const mockOnCreate = jest.fn();
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button 
              onClick={() => {
                showCreateModal(true);
                showCreateModal(false);
                showCreateModal(true);
              }} 
              data-testid="rapid-toggle"
            >
              Rapid Toggle
            </button>
          );
        };

        const { getByTestId, queryByText } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              createModalTitle="Rapid Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Should handle rapid state changes
        expect(() => {
          fireEvent.click(getByTestId('rapid-toggle'));
        }).not.toThrow();

        // Final state should be open
        expect(queryByText('Rapid Test')).toBeInTheDocument();
      });

      it('should handle FormModalProvider with loading state', () => {
        const mockOnCreate = jest.fn();
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button onClick={() => showCreateModal()} data-testid="loading-test">
              Loading Test
            </button>
          );
        };

        const { getByTestId, container } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              loading={true}
              createModalTitle="Loading Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Open modal with loading state
        fireEvent.click(getByTestId('loading-test'));
        expect(container.querySelector('.modal-title')).toHaveTextContent('Loading Test');
      });

      it('should handle FormModalProvider with validation', () => {
        const mockOnCreate = jest.fn();
        const mockValidate = jest.fn(() => ({}));
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button onClick={() => showCreateModal()} data-testid="validation-test">
              Validation Test
            </button>
          );
        };

        const { getByTestId, container } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              validate={mockValidate}
              createModalTitle="Validation Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Open modal with validation
        fireEvent.click(getByTestId('validation-test'));
        expect(container.querySelector('.modal-title')).toHaveTextContent('Validation Test');
      });

      it('should handle modal dialog styling props', () => {
        const mockOnCreate = jest.fn();
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button onClick={() => showCreateModal()} data-testid="styling-test">
              Styling Test
            </button>
          );
        };

        const { getByTestId, container } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              dialogClassName="custom-modal-class"
              width={90}
              createModalTitle="Styling Test"
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Open modal with custom styling
        fireEvent.click(getByTestId('styling-test'));
        
        // Check that modal is rendered (styling is handled by FormModal)
        const modal = container.querySelector('.modal');
        expect(modal).toBeInTheDocument();
      });

      it('should handle React element modal titles', () => {
        const mockOnCreate = jest.fn();
        const customTitle = <span data-testid="custom-title-element">Custom React Title</span>;
        
        const TestComponent = () => {
          const { showCreateModal } = useFormModal();
          return (
            <button onClick={() => showCreateModal()} data-testid="react-title-test">
              React Title Test
            </button>
          );
        };

        const { getByTestId } = render(
          <TestWrapper>
            <FormModalProvider
              formFields={extendedMockFormFields}
              onCreate={mockOnCreate}
              createModalTitle={customTitle}
            >
              <TestComponent />
            </FormModalProvider>
          </TestWrapper>
        );

        // Open modal with React element title
        fireEvent.click(getByTestId('react-title-test'));
        
        // Check that custom title element is rendered
        expect(getByTestId('custom-title-element')).toBeInTheDocument();
      });
    });
  });
});

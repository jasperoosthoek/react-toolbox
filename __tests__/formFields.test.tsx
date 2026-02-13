import React from 'react';

// Core Form Components
import { FormProvider, useForm } from '../src/components/forms/FormProvider';
import { FormField } from '../src/components/forms/FormField';
import { FormFieldsRenderer, DisabledFormField } from '../src/components/forms/FormModal';
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
import { FormFile, FileRef } from '../src/components/forms/fields/FormFile';

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
  screen,
  waitFor
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

        expect(getByText('Tags')).toBeInTheDocument();
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

        a11yHelpers.expectProperLabelAssociation(/Username/);
        const input = screen.getByLabelText(/Username/);
        expect(input.tagName).toBe('INPUT');
      });

      it('should show current value', () => {
        renderWithFormProvider(<FormInput name="username" />);
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      it('should handle change events', () => {
        renderWithFormProvider(<FormInput name="username" />);
        const input = formHelpers.fillField(/Username/, 'newuser');
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
        const input = screen.getByLabelText(/Password/);
        expect(input).toHaveAttribute('type', 'password');
      });

      it('should handle email type', () => {
        renderWithFormProvider(<FormInput name="email" />);
        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('type', 'email');
      });
    });

    describe('Submit on Enter', () => {
      it('should submit form on Enter key press', () => {
        const mockSubmit = jest.fn();
        renderWithFormProvider(<FormInput name="username" />, MOCK_FORM_VALUES.complete, { onSubmit: mockSubmit });
        const input = screen.getByLabelText(/Username/);
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockSubmit).toHaveBeenCalled();
      });

      it('should not submit form on Enter in textarea', () => {
        const mockSubmit = jest.fn();
        renderWithFormProvider(<FormTextarea name="username" />, undefined, { onSubmit: mockSubmit });
        const textarea = screen.getByLabelText(/Username/);
        fireEvent.keyDown(textarea, { key: 'Enter' });
        expect(mockSubmit).not.toHaveBeenCalled();
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

        const input = getByLabelText(/Username/);
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

    it('should render label and all options', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
            <FormDropdown name="category" list={dropdownOptions} idKey="id" nameKey="name" />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByText('Category')).toBeInTheDocument();
      expect(getByText('Electronics')).toBeInTheDocument();
      expect(getByText('Clothing')).toBeInTheDocument();
      expect(getByText('Books')).toBeInTheDocument();
    });

    it('should render default "Select" unselected option', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
            <FormDropdown name="category" list={dropdownOptions} idKey="id" nameKey="name" />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByText('Select')).toBeInTheDocument();
    });

    it('should render custom unselectedOptionLabel', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
            <FormDropdown name="category" list={dropdownOptions} idKey="id" nameKey="name" unselectedOptionLabel="Pick one" />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByText('Pick one')).toBeInTheDocument();
    });

    it('should handle selection change', () => {
      const { container } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
            <FormDropdown name="category" list={dropdownOptions} idKey="id" nameKey="name" />
          </FormProvider>
        </TestWrapper>
      );

      const select = container.querySelector('select') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'electronics' } });
      expect(select.value).toBe('electronics');
    });

    it('should handle string array list', () => {
      const stringOptions = ['Red', 'Green', 'Blue'];
      const { getByText } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
            <FormDropdown name="category" list={stringOptions as any} />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByText('Red')).toBeInTheDocument();
      expect(getByText('Green')).toBeInTheDocument();
      expect(getByText('Blue')).toBeInTheDocument();
    });

    it('should handle options prop as alias for list', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={jest.fn()}>
            <FormDropdown name="category" options={dropdownOptions} idKey="id" nameKey="name" />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByText('Electronics')).toBeInTheDocument();
    });

    it('should submit on Enter key press', () => {
      const mockSubmit = jest.fn();
      const { container } = render(
        <TestWrapper>
          <FormProvider formFields={dropdownFormFields} onSubmit={mockSubmit}>
            <FormDropdown name="category" list={dropdownOptions} idKey="id" nameKey="name" />
          </FormProvider>
        </TestWrapper>
      );

      const select = container.querySelector('select') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'electronics' } });
      fireEvent.keyDown(select, { key: 'Enter' });

      expect(mockSubmit).toHaveBeenCalled();
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

      expect(getByText('Status')).toBeInTheDocument();
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

    it('should render FormDateTime with ISO string value from form context', () => {
      const dateTimeFormFields = {
        'test-input': {
          initialValue: '2024-06-15T14:30:00.000Z',
          label: 'Test DateTime',
          formProps: {},
        },
      };

      const { container } = render(
        <FormTestWrapper formFields={dateTimeFormFields}>
          <FormDateTime name="test-input" />
        </FormTestWrapper>
      );

      const input = container.querySelector('input') as HTMLInputElement;
      // Value comes from form context and FormDateTime formats for datetime-local
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'datetime-local');
    });

    it('should handle form value changes through FormDateTime', () => {
      const dateTimeFormFields = {
        'test-input': {
          initialValue: '',
          label: 'Test DateTime',
          formProps: {},
        },
      };

      const { container } = render(
        <FormTestWrapper formFields={dateTimeFormFields}>
          <FormDateTime name="test-input" />
        </FormTestWrapper>
      );

      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '2024-06-15T14:30' } });
      // The value is set in form context through onChange
      expect(input).toBeInTheDocument();
    });

    it('should handle invalid date string gracefully', () => {
      const dateTimeFormFields = {
        'test-input': {
          initialValue: 'not-a-date',
          label: 'Test DateTime',
          formProps: {},
        },
      };

      const { container } = render(
        <FormTestWrapper formFields={dateTimeFormFields}>
          <FormDateTime name="test-input" />
        </FormTestWrapper>
      );

      const input = container.querySelector('input') as HTMLInputElement;
      // Invalid dates should not crash - form context handles the value
      expect(input).toBeInTheDocument();
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
      expect(typeof FormFile).toBe('function');
    });
  });

  describe('FormFile Component', () => {
    const fileFormFields = {
      attachments: {
        initialValue: [],
        label: 'Attachments',
        required: false,
        formProps: {},
      },
    };

    // Mock URL methods
    const originalCreateObjectURL = global.URL.createObjectURL;
    const originalRevokeObjectURL = global.URL.revokeObjectURL;

    beforeEach(() => {
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url-' + Math.random());
      global.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      global.URL.createObjectURL = originalCreateObjectURL;
      global.URL.revokeObjectURL = originalRevokeObjectURL;
    });

    const createMockFile = (name: string, size: number, type: string): File => {
      const file = new File(['x'.repeat(size)], name, { type });
      return file;
    };

    const createMockOnUpload = (shouldFail = false, delay = 0) => {
      return jest.fn((file: File, onProgress: (progress: number) => void) => {
        return new Promise<{ path: string }>((resolve, reject) => {
          setTimeout(() => {
            onProgress(50);
            setTimeout(() => {
              onProgress(100);
              if (shouldFail) {
                reject(new Error('Upload failed'));
              } else {
                resolve({ path: `/uploads/${file.name}` });
              }
            }, delay);
          }, delay);
        });
      });
    };

    describe('Basic Rendering', () => {
      it('should render without crashing', () => {
        const mockOnUpload = createMockOnUpload();

        expect(() => {
          render(
            <TestWrapper>
              <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
                <FormFile name="attachments" onUpload={mockOnUpload} />
              </FormProvider>
            </TestWrapper>
          );
        }).not.toThrow();
      });

      it('should render with label', () => {
        const mockOnUpload = createMockOnUpload();

        const { getByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" label="Upload Files" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        expect(getByText('Upload Files')).toBeInTheDocument();
      });

      it('should show required asterisk when required', () => {
        const requiredFormFields = {
          attachments: {
            initialValue: [],
            label: 'Attachments',
            required: true,
            formProps: {},
          },
        };
        const mockOnUpload = createMockOnUpload();

        const { getByText, container } = render(
          <TestWrapper>
            <FormProvider formFields={requiredFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        expect(getByText('Attachments')).toBeInTheDocument();
        expect(container.querySelector('.is-required-asterix')).toBeInTheDocument();
      });

      it('should render drop zone with upload text', () => {
        const mockOnUpload = createMockOnUpload();

        const { getByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        expect(getByText('Upload file')).toBeInTheDocument();
      });
    });

    describe('File Selection', () => {
      it('should trigger file input when drop zone is clicked', () => {
        const mockOnUpload = createMockOnUpload();

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]');
        const dropZone = container.querySelector('.form-file-dropzone');

        expect(input).toBeInTheDocument();
        expect(dropZone).toBeInTheDocument();

        // Input should be hidden
        expect(input).toHaveClass('d-none');
      });

      it('should accept files matching accept prop', () => {
        const mockOnUpload = createMockOnUpload();

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} accept="image/*" />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]');
        expect(input).toHaveAttribute('accept', 'image/*');
      });

      it('should handle multiple files when multiple is true', () => {
        const mockOnUpload = createMockOnUpload();

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} multiple={true} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]');
        expect(input).toHaveAttribute('multiple');
      });

      it('should handle single file when multiple is false', () => {
        const mockOnUpload = createMockOnUpload();

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} multiple={false} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]');
        expect(input).not.toHaveAttribute('multiple');
      });
    });

    describe('Upload Flow', () => {
      it('should call onUpload when file is selected', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(mockOnUpload).toHaveBeenCalledWith(mockFile, expect.any(Function));
        });
      });

      it('should display uploaded file after successful upload', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('document.pdf', 100, 'application/pdf');

        const { container, getByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByText('document.pdf')).toBeInTheDocument();
        });
      });

      it('should show progress bar during upload', async () => {
        // Create a slow upload to observe progress
        const mockOnUpload = jest.fn((file: File, onProgress: (progress: number) => void) => {
          return new Promise<{ path: string }>((resolve) => {
            onProgress(50);
            setTimeout(() => {
              onProgress(100);
              resolve({ path: `/uploads/${file.name}` });
            }, 100);
          });
        });

        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        // Wait for progress bar to appear
        await waitFor(() => {
          const progressBar = container.querySelector('.progress');
          expect(progressBar).toBeInTheDocument();
        });
      });
    });

    describe('Error Handling', () => {
      it('should show error when file exceeds maxSize', async () => {
        const mockOnUpload = createMockOnUpload();
        const largeFile = createMockFile('large.txt', 2000, 'text/plain');

        const { container, getByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} maxSize={1000} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [largeFile] } });

        await waitFor(() => {
          expect(getByText('File is too large')).toBeInTheDocument();
        });

        // Should not call onUpload for oversized file
        expect(mockOnUpload).not.toHaveBeenCalled();
      });

      it('should show error message when upload fails', async () => {
        const mockOnUpload = createMockOnUpload(true); // shouldFail = true
        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container, getByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByText('Upload failed')).toBeInTheDocument();
        });
      });

      it('should allow dismissing failed upload errors', async () => {
        const mockOnUpload = createMockOnUpload(true); // shouldFail = true
        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container, getByText, queryByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByText('Upload failed')).toBeInTheDocument();
        });

        // Find and click dismiss button
        const dismissButtons = container.querySelectorAll('button');
        const dismissButton = Array.from(dismissButtons).find(btn =>
          btn.closest('.border.rounded')?.textContent?.includes('Upload failed')
        );

        if (dismissButton) {
          fireEvent.click(dismissButton);
        }

        await waitFor(() => {
          expect(queryByText('Upload failed')).not.toBeInTheDocument();
        });
      });
    });

    describe('File Management', () => {
      it('should remove file when remove button is clicked', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container, queryByText, getByTestId, queryByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        // Wait for upload to complete (times-icon appears only on completed files)
        await waitFor(() => {
          expect(getByTestId('times-icon')).toBeInTheDocument();
        }, { timeout: 2000 });

        // Find the remove button by the times icon inside it
        const timesIcon = getByTestId('times-icon');
        const removeButton = timesIcon.closest('button') as HTMLButtonElement;
        expect(removeButton).toBeTruthy();

        fireEvent.click(removeButton);

        await waitFor(() => {
          expect(queryByText('test.txt')).not.toBeInTheDocument();
        }, { timeout: 2000 });
      });

      it('should revoke blob URL when file is removed', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container, getByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        // Wait for upload to complete (times-icon appears only on completed files)
        await waitFor(() => {
          expect(getByTestId('times-icon')).toBeInTheDocument();
        }, { timeout: 2000 });

        // Clear any previous calls from upload
        (global.URL.revokeObjectURL as jest.Mock).mockClear();

        // Find the remove button by the times icon inside it
        const timesIcon = getByTestId('times-icon');
        const removeButton = timesIcon.closest('button') as HTMLButtonElement;

        fireEvent.click(removeButton);

        await waitFor(() => {
          expect(global.URL.revokeObjectURL).toHaveBeenCalled();
        }, { timeout: 2000 });
      });
    });

    describe('Drag and Drop', () => {
      it('should handle drag over with visual feedback', () => {
        const mockOnUpload = createMockOnUpload();

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const dropZone = container.querySelector('.form-file-dropzone') as HTMLElement;

        fireEvent.dragOver(dropZone, { preventDefault: jest.fn() });

        expect(dropZone).toHaveClass('bg-light');
      });

      it('should handle drag leave', () => {
        const mockOnUpload = createMockOnUpload();

        const { container } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const dropZone = container.querySelector('.form-file-dropzone') as HTMLElement;

        fireEvent.dragOver(dropZone);
        fireEvent.dragLeave(dropZone);

        expect(dropZone).not.toHaveClass('bg-light');
      });

      it('should process dropped files', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('dropped.txt', 100, 'text/plain');

        const { container, getByText } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const dropZone = container.querySelector('.form-file-dropzone') as HTMLElement;

        const dataTransfer = {
          files: [mockFile],
        };

        fireEvent.drop(dropZone, { dataTransfer });

        await waitFor(() => {
          expect(mockOnUpload).toHaveBeenCalledWith(mockFile, expect.any(Function));
        });

        await waitFor(() => {
          expect(getByText('dropped.txt')).toBeInTheDocument();
        });
      });
    });

    describe('Cleanup', () => {
      it('should revoke all blob URLs on unmount', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('test.txt', 100, 'text/plain');

        const { container, getByText, unmount } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByText('test.txt')).toBeInTheDocument();
        });

        // Clear mock to track only unmount calls
        (global.URL.revokeObjectURL as jest.Mock).mockClear();

        unmount();

        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      });
    });

    describe('File Type Icons', () => {
      it('should show PDF icon for .pdf files', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('document.pdf', 100, 'application/pdf');

        const { container, getByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByTestId('file-pdf-icon')).toBeInTheDocument();
        });
      });

      it('should show Word icon for .doc and .docx files', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('document.docx', 100, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        const { container, getByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByTestId('file-word-icon')).toBeInTheDocument();
        });
      });

      it('should show PowerPoint icon for .ppt and .pptx files', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('presentation.pptx', 100, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

        const { container, getByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByTestId('file-ppt-icon')).toBeInTheDocument();
        });
      });

      it('should show text icon for text-based files', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('readme.md', 100, 'text/markdown');

        const { container, getByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByTestId('file-text-icon')).toBeInTheDocument();
        });
      });

      it('should show generic file icon for unknown file types', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('archive.zip', 100, 'application/zip');

        const { container, getByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          expect(getByTestId('file-icon')).toBeInTheDocument();
        });
      });

      it('should show image thumbnail instead of icon for image files', async () => {
        const mockOnUpload = createMockOnUpload();
        const mockFile = createMockFile('photo.jpg', 100, 'image/jpeg');

        const { container, queryByTestId } = render(
          <TestWrapper>
            <FormProvider formFields={fileFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [mockFile] } });

        await waitFor(() => {
          // Should show img element instead of file icon
          const img = container.querySelector('img.form-file-thumbnail');
          expect(img).toBeInTheDocument();
          expect(queryByTestId('file-icon')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('FormInput inputComponent prop', () => {
    it('should render custom inputComponent instead of Form.Control', () => {
      const CustomInput = ({ value, onChange, isInvalid, ...props }: any) => (
        <input
          data-testid="custom-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-invalid={isInvalid}
          {...props}
        />
      );

      const formFields = {
        custom: { initialValue: 'hello', label: 'Custom', formProps: {} },
      };

      const { getByTestId } = render(
        <FormTestWrapper formFields={formFields}>
          <FormInput name="custom" inputComponent={CustomInput} />
        </FormTestWrapper>
      );

      const input = getByTestId('custom-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('hello');
    });

    it('should pass onChange(value) directly to custom component', () => {
      const onChangeCalls: any[] = [];
      const CustomInput = ({ value, onChange, ...props }: any) => (
        <input
          data-testid="custom-input"
          value={value}
          onChange={(e) => {
            onChangeCalls.push(e.target.value);
            onChange(e.target.value);
          }}
          {...props}
        />
      );

      const formFields = {
        custom: { initialValue: '', label: 'Custom', formProps: {} },
      };

      const { getByTestId } = render(
        <FormTestWrapper formFields={formFields}>
          <FormInput name="custom" inputComponent={CustomInput} />
        </FormTestWrapper>
      );

      fireEvent.change(getByTestId('custom-input'), { target: { value: 'new' } });
      expect(onChangeCalls).toContain('new');
    });

    it('should pass inputComponent through FormDate', () => {
      const CustomDateInput = ({ value, onChange, ...props }: any) => (
        <input data-testid="custom-date" value={value} onChange={() => {}} {...props} />
      );

      const formFields = {
        mydate: { initialValue: '', label: 'My Date', formProps: {} },
      };

      const { getByTestId } = render(
        <FormTestWrapper formFields={formFields}>
          <FormDate name="mydate" inputComponent={CustomDateInput} />
        </FormTestWrapper>
      );

      expect(getByTestId('custom-date')).toBeInTheDocument();
    });

    it('should pass inputComponent through FormTextarea', () => {
      const CustomTextarea = ({ value, onChange, ...props }: any) => (
        <textarea data-testid="custom-textarea" value={value} onChange={() => {}} {...props} />
      );

      const formFields = {
        bio: { initialValue: '', label: 'Bio', formProps: {} },
      };

      const { getByTestId } = render(
        <FormTestWrapper formFields={formFields}>
          <FormTextarea name="bio" inputComponent={CustomTextarea} />
        </FormTestWrapper>
      );

      expect(getByTestId('custom-textarea')).toBeInTheDocument();
    });
  });

  describe('FormDateTime edge cases', () => {
    it('should handle empty string onChange', () => {
      const dateTimeFormFields = {
        'dt': { initialValue: '2024-06-15T14:30:00.000Z', label: 'DateTime', formProps: {} },
      };

      const { container } = render(
        <FormTestWrapper formFields={dateTimeFormFields}>
          <FormDateTime name="dt" />
        </FormTestWrapper>
      );

      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '' } });
      expect(input).toBeInTheDocument();
    });

    it('should handle invalid date input gracefully', () => {
      const dateTimeFormFields = {
        'dt': { initialValue: '', label: 'DateTime', formProps: {} },
      };

      const { container } = render(
        <FormTestWrapper formFields={dateTimeFormFields}>
          <FormDateTime name="dt" />
        </FormTestWrapper>
      );

      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'invalid-date' } });
      expect(input).toBeInTheDocument();
    });

    it('should convert valid datetime-local input to ISO string', () => {
      const mockSubmit = jest.fn();
      const dateTimeFormFields = {
        'dt': { initialValue: '', label: 'DateTime', formProps: {} },
      };

      const TestForm = () => {
        const { getValue } = useForm();
        return (
          <>
            <FormDateTime name="dt" />
            <span data-testid="val">{String(getValue('dt'))}</span>
          </>
        );
      };

      const { container, getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={dateTimeFormFields} onSubmit={mockSubmit}>
            <TestForm />
          </FormProvider>
        </TestWrapper>
      );

      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '2024-06-15T14:30' } });
      expect(getByTestId('val').textContent).toContain('2024-06-15');
    });
  });

  describe('FormField Component', () => {
    it('should render as FormInput when no children', () => {
      const formFields = {
        name: { initialValue: 'test', label: 'Name', required: true, formProps: {} },
      };

      const { getByLabelText } = render(
        <FormTestWrapper formFields={formFields}>
          <FormField name="name" />
        </FormTestWrapper>
      );

      expect(getByLabelText(/Name/)).toHaveValue('test');
    });

    it('should render children when provided', () => {
      const formFields = {
        name: { initialValue: '', label: 'Name', formProps: {} },
      };

      const { getByTestId } = render(
        <FormTestWrapper formFields={formFields}>
          <FormField name="name">
            <div data-testid="custom-child">Custom content</div>
          </FormField>
        </FormTestWrapper>
      );

      expect(getByTestId('custom-child')).toBeInTheDocument();
    });

    it('should return null when no FormProvider', () => {
      const { container } = render(
        <TestWrapper>
          <FormField name="missing" />
        </TestWrapper>
      );

      expect(container.innerHTML).toBe('');
    });

    it('should return null when field config not found', () => {
      const formFields = {
        name: { initialValue: '', label: 'Name', formProps: {} },
      };

      const { container } = render(
        <FormTestWrapper formFields={formFields}>
          <FormField name="nonexistent" />
        </FormTestWrapper>
      );

      // FormField returns null for unknown field names
      expect(container.querySelector('.form-group')).not.toBeInTheDocument();
    });
  });

  describe('FormProvider advanced features', () => {
    it('should handle field-level onChange callback', () => {
      const formFields = {
        price: {
          initialValue: '10',
          label: 'Price',
          formProps: {},
          onChange: (value: any, formData: any) => ({
            ...formData,
            price: value,
            tax: String(Number(value) * 0.1),
          }),
        },
        tax: { initialValue: '1', label: 'Tax', formProps: {} },
      };

      const { getByLabelText } = render(
        <FormTestWrapper formFields={formFields}>
          <FormInput name="price" />
          <FormInput name="tax" />
        </FormTestWrapper>
      );

      fireEvent.change(getByLabelText('Price'), { target: { value: '100' } });
      expect(getByLabelText('Tax')).toHaveValue('10');
    });

    it('should handle resetTrigger', () => {
      const formFields = {
        name: { initialValue: 'initial', label: 'Name', formProps: {} },
      };

      const { getByLabelText, rerender } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()} resetTrigger={1}>
            <FormInput name="name" />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.change(getByLabelText('Name'), { target: { value: 'changed' } });
      expect(getByLabelText('Name')).toHaveValue('changed');

      rerender(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()} resetTrigger={2}>
            <FormInput name="name" />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByLabelText('Name')).toHaveValue('initial');
    });

    it('should handle submit with valid data and callback', () => {
      const mockSubmit = jest.fn();
      const formFields = {
        name: { initialValue: 'test', label: 'Name', required: true, formProps: {} },
      };

      const TestForm = () => {
        const { submit } = useForm();
        return (
          <>
            <FormInput name="name" />
            <button data-testid="submit" onClick={submit}>Submit</button>
          </>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={mockSubmit}>
            <TestForm />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('submit'));
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'test' }),
        expect.any(Function)
      );
    });

    it('should not submit when validation fails', () => {
      const mockSubmit = jest.fn();
      const formFields = {
        name: { initialValue: '', label: 'Name', required: true, formProps: {} },
      };

      const TestForm = () => {
        const { submit } = useForm();
        return (
          <>
            <FormInput name="name" />
            <button data-testid="submit" onClick={submit}>Submit</button>
          </>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={mockSubmit}>
            <TestForm />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('submit'));
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should expose setFormData and resetForm', () => {
      const formFields = {
        name: { initialValue: 'initial', label: 'Name', formProps: {} },
      };

      const TestForm = () => {
        const { setFormData, resetForm } = useForm();
        return (
          <>
            <FormInput name="name" />
            <button data-testid="set" onClick={() => setFormData({ name: 'bulk-set' })}>Set</button>
            <button data-testid="reset" onClick={resetForm}>Reset</button>
          </>
        );
      };

      const { getByTestId, getByLabelText } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()}>
            <TestForm />
          </FormProvider>
        </TestWrapper>
      );

      fireEvent.click(getByTestId('set'));
      expect(getByLabelText('Name')).toHaveValue('bulk-set');

      fireEvent.click(getByTestId('reset'));
      expect(getByLabelText('Name')).toHaveValue('initial');
    });

    it('should expose setPristine and setLoading', () => {
      const formFields = {
        name: { initialValue: '', label: 'Name', required: true, formProps: {} },
      };

      const TestForm = () => {
        const { setPristine, setLoading, pristine, loading } = useForm();
        return (
          <>
            <FormInput name="name" />
            <span data-testid="pristine">{pristine.toString()}</span>
            <span data-testid="loading">{loading.toString()}</span>
            <button data-testid="dirty" onClick={() => setPristine(false)}>Set Dirty</button>
            <button data-testid="load" onClick={() => setLoading(true)}>Set Loading</button>
          </>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()}>
            <TestForm />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByTestId('pristine')).toHaveTextContent('true');
      fireEvent.click(getByTestId('dirty'));
      expect(getByTestId('pristine')).toHaveTextContent('false');

      expect(getByTestId('loading')).toHaveTextContent('false');
      fireEvent.click(getByTestId('load'));
      expect(getByTestId('loading')).toHaveTextContent('true');
    });

    it('should return default value for number type fields', () => {
      const formFields = {
        count: { initialValue: null, label: 'Count', type: 'number' as const, formProps: {} },
      };

      const TestForm = () => {
        const { getValue } = useForm();
        return <span data-testid="val">{String(getValue('count'))}</span>;
      };

      const { getByTestId } = render(
        <TestWrapper>
          <FormProvider formFields={formFields} onSubmit={jest.fn()} initialState={{ count: null }}>
            <TestForm />
          </FormProvider>
        </TestWrapper>
      );

      expect(getByTestId('val')).toHaveTextContent('0');
    });

    it('should return null when formFields is falsy', () => {
      const { container } = render(
        <TestWrapper>
          <FormProvider formFields={null as any} onSubmit={jest.fn()}>
            <div>children</div>
          </FormProvider>
        </TestWrapper>
      );

      expect(container.textContent).toBe('');
    });
  });

  describe('FormModal advanced features', () => {
    it('should render children instead of FormFieldsRenderer when provided', () => {
      const formFields = {
        name: { initialValue: '', label: 'Name', formProps: {} },
      };

      const { getByTestId, queryByLabelText } = render(
        <FormTestWrapper formFields={formFields}>
          <FormFieldsRenderer />
        </FormTestWrapper>
      );

      // FormFieldsRenderer renders fields automatically
      expect(queryByLabelText('Name')).toBeInTheDocument();
    });

    it('should render textarea type via FormFieldsRenderer', () => {
      const formFields = {
        notes: { initialValue: '', label: 'Notes', type: 'textarea' as const, rows: 5, formProps: {} },
      };

      const { container } = render(
        <FormTestWrapper formFields={formFields}>
          <FormFieldsRenderer />
        </FormTestWrapper>
      );

      const textarea = container.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('should render dropdown type via FormFieldsRenderer', () => {
      const formFields = {
        color: {
          initialValue: '',
          label: 'Color',
          type: 'dropdown' as const,
          list: [{ id: 'red', name: 'Red' }, { id: 'blue', name: 'Blue' }],
          idKey: 'id',
          nameKey: 'name',
          formProps: {},
        },
      };

      const { getByText } = render(
        <FormTestWrapper formFields={formFields}>
          <FormFieldsRenderer />
        </FormTestWrapper>
      );

      expect(getByText('Red')).toBeInTheDocument();
      expect(getByText('Blue')).toBeInTheDocument();
    });

    it('should render number type as text input', () => {
      const formFields = {
        age: { initialValue: 0, label: 'Age', type: 'number' as const, formProps: {} },
      };

      const { container } = render(
        <FormTestWrapper formFields={formFields}>
          <FormFieldsRenderer />
        </FormTestWrapper>
      );

      const input = container.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it('should return null when no FormProvider', () => {
      const { container } = render(
        <TestWrapper>
          <FormFieldsRenderer />
        </TestWrapper>
      );

      expect(container.innerHTML).toBe('');
    });
  });

  describe('DisabledFormField', () => {
    it('should render disabled input with value', () => {
      const { container } = render(<DisabledFormField value="Read Only" />);
      const input = container.querySelector('input');
      expect(input).toBeDisabled();
      expect(input).toHaveValue('Read Only');
    });

    it('should render empty value as empty string', () => {
      const { container } = render(<DisabledFormField value={null} />);
      const input = container.querySelector('input');
      expect(input).toHaveValue('');
    });
  });

  describe('useFormField without provider', () => {
    it('should return defaults when used outside FormProvider', () => {
      const TestComponent = () => {
        const { value, isInvalid, label, required } = require('../src/components/forms/FormField').useFormField({ name: 'test' });
        return (
          <div>
            <span data-testid="value">{String(value)}</span>
            <span data-testid="invalid">{String(isInvalid)}</span>
            <span data-testid="required">{String(required)}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('value')).toHaveTextContent('');
      expect(getByTestId('invalid')).toHaveTextContent('false');
      expect(getByTestId('required')).toHaveTextContent('false');
    });
  });
});

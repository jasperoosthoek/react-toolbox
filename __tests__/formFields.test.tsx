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

        const { getByText } = render(
          <TestWrapper>
            <FormProvider formFields={requiredFormFields} onSubmit={jest.fn()}>
              <FormFile name="attachments" onUpload={mockOnUpload} />
            </FormProvider>
          </TestWrapper>
        );

        expect(getByText('Attachments *')).toBeInTheDocument();
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
});

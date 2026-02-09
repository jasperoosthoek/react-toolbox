import React from 'react';
import { LocalizationProvider } from '../src/localization/LocalizationContext';

// Core Form Components
import { FormProvider } from '../src/components/forms/FormProvider';
import { FormModal, FormFieldsRenderer } from '../src/components/forms/FormModal';

// Import FormModalProvider components
import {
  FormModalProvider,
  FormCreateModalButton,
  FormEditModalButton,
  useFormModal
} from '../src/components/forms/FormModalProvider';

// Import test utilities
import {
  TestWrapper,
  FormTestWrapper,
  renderWithLocalization,
  MOCK_MODAL_DATA,
  renderHelpers,
  render,
  fireEvent,
} from './utils';

describe('Form Modal Tests', () => {
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
    });
  });

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
    });

    describe('FormModal Buttons', () => {
      it('should render save button with default text', () => {
        const { getByText } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} modalTitle="Test" />
          </FormTestWrapper>
        );

        expect(getByText('Save')).toBeInTheDocument();
      });

      it('should render save button with custom text', () => {
        const { getByText } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} modalTitle="Test" submitText="Submit Form" />
          </FormTestWrapper>
        );

        expect(getByText('Submit Form')).toBeInTheDocument();
      });

      it('should render cancel button with default text', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} modalTitle="Test" />
          </FormTestWrapper>
        );

        const closeButton = container.querySelector('.modal-footer .btn-secondary');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveTextContent('Close');
      });

      it('should call onHide when cancel is clicked', () => {
        const { container } = render(
          <FormTestWrapper>
            <FormModal show={true} onHide={mockOnHide} modalTitle="Test" />
          </FormTestWrapper>
        );

        const closeButton = container.querySelector('.modal-footer .btn-secondary');
        if (closeButton) fireEvent.click(closeButton);
        expect(mockOnHide).toHaveBeenCalled();
      });
    });

    describe('FormModal Width', () => {
      it('should handle width prop', () => {
        expect(() => {
          render(
            <FormTestWrapper>
              <FormModal show={true} onHide={mockOnHide} modalTitle="Test" width={75} />
            </FormTestWrapper>
          );
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

        expect(getByText('Name')).toBeInTheDocument();
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
    });
  });

  describe('FormModalProvider Extended Tests', () => {
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

      const { getByTestId, queryByText } = render(
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

      fireEvent.click(getByTestId('open-true'));
      expect(queryByText('Boolean Parameter Test')).toBeInTheDocument();

      fireEvent.click(getByTestId('open-false'));
      expect(queryByText('Boolean Parameter Test')).not.toBeInTheDocument();

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

      fireEvent.click(getByTestId('edit-1'));
      expect(queryByText('Multi-State Test')).toBeInTheDocument();

      const nameInput = getByLabelText(/Name/) as HTMLInputElement;
      expect(nameInput.value).toBe('User 1');

      fireEvent.click(getByTestId('edit-2'));
      expect(nameInput.value).toBe('User 2');

      fireEvent.click(getByTestId('close-edit'));
      expect(queryByText('Multi-State Test')).not.toBeInTheDocument();
    });
  });

  describe('Component Export Verification', () => {
    it('should export FormModal as function', () => {
      expect(typeof FormModal).toBe('function');
    });

    it('should export FormFieldsRenderer as function', () => {
      expect(typeof FormFieldsRenderer).toBe('function');
    });

    it('should export FormModalProvider as function', () => {
      expect(typeof FormModalProvider).toBe('function');
    });

    it('should export useFormModal as function', () => {
      expect(typeof useFormModal).toBe('function');
    });

    it('should export FormCreateModalButton as function', () => {
      expect(typeof FormCreateModalButton).toBe('function');
    });

    it('should export FormEditModalButton as function', () => {
      expect(typeof FormEditModalButton).toBe('function');
    });
  });
});

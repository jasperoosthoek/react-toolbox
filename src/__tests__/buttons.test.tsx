import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Button } from 'react-bootstrap';
import { LocalizationProvider } from '../localization/LocalizationContext';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DeleteConfirmButton from '../components/buttons/DeleteConfirmButton';
import {
  IconButton,
  CheckButton,
  CopyButton,
  CloseButton,
  CreateButton,
  DeleteButton,
  EditButton,
  SaveButton,
  UploadTextButton,
  makeIconButton,
} from '../components/buttons/IconButtons';
import { AiOutlineHome } from 'react-icons/ai';

// Mock the SmallSpinner component
jest.mock('../components/indicators/LoadingIndicator', () => ({
  SmallSpinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Test wrapper with localization context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('Button Components Tests', () => {
  describe('ConfirmButton', () => {
    const defaultProps = {
      onConfirm: jest.fn(),
      buttonComponent: Button,
      children: 'Click me',
    };

    const renderWithLocalization = (ui: React.ReactElement) => {
      return render(
        <TestWrapper>
          {ui}
        </TestWrapper>
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('Basic Functionality', () => {
      it('should render the button component', () => {
        const { getByRole } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        expect(getByRole('button')).toBeInTheDocument();
        expect(getByRole('button')).toHaveTextContent('Click me');
      });

      it('should not show modal initially', () => {
        const { queryByRole } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('should show modal when button is clicked', () => {
        const { getByRole } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        fireEvent.click(getByRole('button'));

        expect(getByRole('dialog')).toBeInTheDocument();
      });

      it('should close modal when cancel button is clicked', () => {
        const { getByRole, getByText, queryByRole } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        fireEvent.click(getByRole('button'));
        expect(getByRole('dialog')).toBeInTheDocument();

        fireEvent.click(getByText('Cancel'));
        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('should close modal when close button is clicked', () => {
        const { getByRole, queryByRole } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        fireEvent.click(getByRole('button'));
        expect(getByRole('dialog')).toBeInTheDocument();

        const closeButton = getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    describe('Confirm Action', () => {
      it('should call onConfirm when confirm button is clicked', async () => {
        const onConfirm = jest.fn();
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton {...defaultProps} onConfirm={onConfirm} />
        );

        fireEvent.click(getByRole('button'));
        fireEvent.click(getByText('OK'));

        await waitFor(() => {
          expect(onConfirm).toHaveBeenCalledWith(expect.any(Function));
        });
      });

      it('should close modal after onConfirm when closeUsingCallback is false', async () => {
        const onConfirm = jest.fn();
        const { getByRole, getByText, queryByRole } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            onConfirm={onConfirm} 
            closeUsingCallback={false}
          />
        );

        fireEvent.click(getByRole('button'));
        fireEvent.click(getByText('OK'));

        await waitFor(() => {
          expect(queryByRole('dialog')).not.toBeInTheDocument();
        });
      });

      it('should not auto-close modal when closeUsingCallback is true', async () => {
        const onConfirm = jest.fn();
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            onConfirm={onConfirm} 
            closeUsingCallback={true}
          />
        );

        fireEvent.click(getByRole('button'));
        fireEvent.click(getByText('OK'));

        await waitFor(() => {
          expect(onConfirm).toHaveBeenCalled();
        });

        // Modal should still be open since closeUsingCallback is true
        expect(getByRole('dialog')).toBeInTheDocument();
      });

      it('should close modal using callback when closeUsingCallback is true', async () => {
        const onConfirm = jest.fn((closeModal) => {
          closeModal();
        });
        const { getByRole, getByText, queryByRole } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            onConfirm={onConfirm} 
            closeUsingCallback={true}
          />
        );

        fireEvent.click(getByRole('button'));
        fireEvent.click(getByText('OK'));

        await waitFor(() => {
          expect(queryByRole('dialog')).not.toBeInTheDocument();
        });
      });
    });

    describe('Custom Text Props', () => {
      it('should display custom modal title', () => {
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            modalTitle="Custom Title"
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByText('Custom Title')).toBeInTheDocument();
      });

      it('should display custom modal body', () => {
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            modalBody="Custom body message"
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByText('Custom body message')).toBeInTheDocument();
      });

      it('should display default "Are you sure?" when no modalBody provided', () => {
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        fireEvent.click(getByRole('button'));
        expect(getByText('Are you sure?')).toBeInTheDocument();
      });

      it('should display custom confirm text', () => {
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            confirmText="Yes, Delete"
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByText('Yes, Delete')).toBeInTheDocument();
      });

      it('should display custom cancel text', () => {
        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            cancelText="No, Keep"
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByText('No, Keep')).toBeInTheDocument();
      });
    });

    describe('Loading State', () => {
      it('should show spinner when loading is true', () => {
        const { getByRole, getByTestId } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            loading={true}
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      it('should not show spinner when loading is false', () => {
        const { getByRole, queryByTestId } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            loading={false}
          />
        );

        fireEvent.click(getByRole('button'));
        expect(queryByTestId('spinner')).not.toBeInTheDocument();
      });
    });

    describe('ReactElement Props', () => {
      it('should render ReactElement as modal title', () => {
        const CustomTitle = <span data-testid="custom-title">Custom React Title</span>;
        const { getByRole, getByTestId } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            modalTitle={CustomTitle}
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByTestId('custom-title')).toBeInTheDocument();
      });

      it('should render ReactElement as modal body', () => {
        const CustomBody = <div data-testid="custom-body">Custom React Body</div>;
        const { getByRole, getByTestId } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            modalBody={CustomBody}
          />
        );

        fireEvent.click(getByRole('button'));
        expect(getByTestId('custom-body')).toBeInTheDocument();
      });
    });

    describe('Event Handling', () => {
      it('should stop propagation on modal click', () => {
        const { getByRole } = renderWithLocalization(
          <ConfirmButton {...defaultProps} />
        );

        fireEvent.click(getByRole('button'));
        const modal = getByRole('dialog');
        
        const clickEvent = new MouseEvent('click', { bubbles: true });
        const stopPropagationSpy = jest.spyOn(clickEvent, 'stopPropagation');
        
        fireEvent(modal, clickEvent);
        expect(stopPropagationSpy).toHaveBeenCalled();
      });

      it('should handle async onConfirm function', async () => {
        const onConfirm = jest.fn(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
        });

        const { getByRole, getByText } = renderWithLocalization(
          <ConfirmButton {...defaultProps} onConfirm={onConfirm} />
        );

        fireEvent.click(getByRole('button'));
        fireEvent.click(getByText('OK'));

        await waitFor(() => {
          expect(onConfirm).toHaveBeenCalled();
        });
      });
    });

    describe('Button Props Passthrough', () => {
      it('should pass additional props to button component', () => {
        const { getByRole } = renderWithLocalization(
          <ConfirmButton 
            {...defaultProps} 
            variant="danger"
            size="lg"
            disabled={true}
          />
        );

        const button = getByRole('button');
        expect(button).toHaveClass('btn-danger');
        expect(button).toHaveClass('btn-lg');
        expect(button).toBeDisabled();
      });
    });
  });

  describe('DeleteConfirmButton', () => {
    const mockOnDelete = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render DeleteConfirmButton without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DeleteConfirmButton
              onDelete={mockOnDelete}
            >
              Delete
            </DeleteConfirmButton>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should accept custom modal props', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DeleteConfirmButton
              onDelete={mockOnDelete}
              modalTitle="Delete Item"
              modalBody="Are you sure you want to delete this?"
              confirmText="Delete"
              loading={true}
            >
              Delete Item
            </DeleteConfirmButton>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof DeleteConfirmButton).toBe('function');
    });
  });

  describe('IconButton', () => {
    it('should render IconButton without crashing', () => {
      expect(() => {
        render(
          <IconButton icon={AiOutlineHome}>
            Home
          </IconButton>
        );
      }).not.toThrow();
    });

    it('should handle loading state', () => {
      expect(() => {
        render(
          <IconButton 
            icon={AiOutlineHome} 
            loading={true}
            iconSize="16px"
          >
            Loading
          </IconButton>
        );
      }).not.toThrow();
    });

    it('should handle click events', () => {
      const mockClick = jest.fn();
      const { getByRole } = render(
        <IconButton 
          icon={AiOutlineHome} 
          onClick={mockClick}
        >
          Click Me
        </IconButton>
      );

      const button = getByRole('button');
      fireEvent.click(button);
      
      expect(mockClick).toHaveBeenCalled();
    });

    it('should be a valid React component', () => {
      expect(typeof IconButton).toBe('function');
    });
  });

  describe('Predefined Icon Buttons', () => {
    const iconButtons = [
      { component: CheckButton, name: 'CheckButton' },
      { component: CopyButton, name: 'CopyButton' },
      { component: CloseButton, name: 'CloseButton' },
      { component: CreateButton, name: 'CreateButton' },
      { component: DeleteButton, name: 'DeleteButton' },
      { component: EditButton, name: 'EditButton' },
      { component: SaveButton, name: 'SaveButton' },
    ];

    iconButtons.forEach(({ component: ButtonComponent, name }) => {
      it(`should render ${name} without crashing`, () => {
        expect(() => {
          render(<ButtonComponent>Test</ButtonComponent>);
        }).not.toThrow();
      });

      it(`${name} should be a valid React component`, () => {
        expect(typeof ButtonComponent).toBe('function');
      });

      it(`${name} should handle props correctly`, () => {
        expect(() => {
          render(
            <ButtonComponent 
              loading={true}
              variant="primary"
              size="lg"
              disabled={true}
            >
              Test Button
            </ButtonComponent>
          );
        }).not.toThrow();
      });
    });
  });

  describe('UploadTextButton', () => {
    const mockOnLoadFile = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render UploadTextButton without crashing', () => {
      expect(() => {
        render(
          <UploadTextButton onLoadFile={mockOnLoadFile}>
            Upload File
          </UploadTextButton>
        );
      }).not.toThrow();
    });

    it('should accept file type restrictions', () => {
      expect(() => {
        render(
          <UploadTextButton 
            onLoadFile={mockOnLoadFile}
            accept=".txt,.json"
          >
            Upload Text File
          </UploadTextButton>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof UploadTextButton).toBe('function');
    });
  });

  describe('makeIconButton factory', () => {
    it('should create valid icon button components', () => {
      const CustomIconButton = makeIconButton(AiOutlineHome);
      
      expect(typeof CustomIconButton).toBe('function');
      
      expect(() => {
        render(<CustomIconButton>Custom Button</CustomIconButton>);
      }).not.toThrow();
    });

    it('should be a valid function', () => {
      expect(typeof makeIconButton).toBe('function');
    });
  });

  describe('Button Props Handling', () => {
    it('should handle various ButtonProps correctly', () => {
      const commonProps = {
        variant: 'primary' as const,
        size: 'lg' as const,
        disabled: true,
        className: 'test-class',
        loading: true,
        iconSize: '20px',
      };

      expect(() => {
        render(<CheckButton {...commonProps}>Check</CheckButton>);
      }).not.toThrow();
    });
  });
});

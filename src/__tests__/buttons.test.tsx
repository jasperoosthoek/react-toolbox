import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

// Test wrapper with localization context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('Button Components Tests', () => {
  describe('ConfirmButton', () => {
    const mockOnConfirm = jest.fn();
    const mockButtonComponent = ({ children, onClick, ...props }: any) => (
      <button {...props} onClick={onClick}>
        {children}
      </button>
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render ConfirmButton without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfirmButton
              onConfirm={mockOnConfirm}
              buttonComponent={mockButtonComponent}
            >
              Test Button
            </ConfirmButton>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should accept custom modal props', () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfirmButton
              onConfirm={mockOnConfirm}
              buttonComponent={mockButtonComponent}
              modalTitle="Custom Title"
              modalBody="Custom Body"
              confirmText="Confirm"
              cancelText="Cancel"
              loading={true}
              closeUsingCallback={true}
            >
              Test Button
            </ConfirmButton>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof ConfirmButton).toBe('function');
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

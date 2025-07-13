import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Button } from 'react-bootstrap';
import ConfirmButton from '../components/buttons/ConfirmButton';
import { LocalizationProvider } from '../localization/LocalizationContext';

// Mock the SmallSpinner component
jest.mock('../components/indicators/LoadingIndicator', () => ({
  SmallSpinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('ConfirmButton', () => {
  const defaultProps = {
    onConfirm: jest.fn(),
    buttonComponent: Button,
    children: 'Click me',
  };

  const renderWithLocalization = (ui: React.ReactElement) => {
    return render(
      <LocalizationProvider>
        {ui}
      </LocalizationProvider>
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

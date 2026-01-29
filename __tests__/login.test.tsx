import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '../src/localization/LocalizationContext';
import { LoginPage } from '../src/components/login/LoginPage';
import { RequestPasswordResetPage } from '../src/components/login/RequestPasswordResetPage';
import { SetPasswordPage } from '../src/components/login/SetPasswordPage';

// Test wrapper with localization context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('Login Components Tests', () => {
  describe('LoginPage', () => {
    const mockOnSubmit = jest.fn();
    const mockCallback = jest.fn();
    const mockOnResetPassword = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be a valid React component', () => {
      expect(typeof LoginPage).toBe('function');
    });

    it('should render without crashing when not authenticated', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should not render when authenticated', () => {
      const { container } = render(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={true}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle string reset password prop', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="https://example.com/reset"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle function reset password prop', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword={mockOnResetPassword}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle string label prop', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
              label="Custom Login Title"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle ReactElement label prop', () => {
      const customLabel = <h2>Custom Login Component</h2>;

      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
              label={customLabel}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle callback prop', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
              callback={mockCallback}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle all props together', () => {
      const customLabel = <h1 className="title">Welcome</h1>;

      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword={mockOnResetPassword}
              label={customLabel}
              callback={mockCallback}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('LoginPage Authentication Logic', () => {
    const mockOnSubmit = jest.fn();

    it('should render content when not authenticated', () => {
      const { container } = render(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={false}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).not.toBeNull();
    });

    it('should not render anything when authenticated', () => {
      const { container } = render(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={true}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle authentication state changes', () => {
      const { container, rerender } = render(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={false}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).not.toBeNull();

      rerender(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={true}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('LoginPage Props Validation', () => {
    const mockOnSubmit = jest.fn();

    it('should handle required props', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle optional props', () => {
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword={jest.fn()}
              label="Optional Label"
              callback={jest.fn()}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle various prop combinations', () => {
      const propCombinations = [
        {
          onSubmit: mockOnSubmit,
          isAuthenticated: false,
          onResetPassword: '#reset',
        },
        {
          onSubmit: mockOnSubmit,
          isAuthenticated: true,
          onResetPassword: jest.fn(),
        },
        {
          onSubmit: mockOnSubmit,
          isAuthenticated: false,
          onResetPassword: '#reset',
          label: 'Custom Label',
          callback: jest.fn(),
        },
        {
          onSubmit: mockOnSubmit,
          isAuthenticated: false,
          onResetPassword: jest.fn(),
          label: <div>JSX Label</div>,
        },
      ];

      propCombinations.forEach((props) => {
        expect(() => {
          render(
            <TestWrapper>
              <LoginPage {...props} />
            </TestWrapper>
          );
        }).not.toThrow();
      });
    });
  });

  describe('LoginPage Component Behavior', () => {
    const mockOnSubmit = jest.fn();
    const mockOnResetPassword = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should handle various reset password types', () => {
      // Test with string URL
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="https://example.com/reset"
            />
          </TestWrapper>
        );
      }).not.toThrow();

      // Test with function callback
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword={mockOnResetPassword}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle label variations', () => {
      // Test without label
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
            />
          </TestWrapper>
        );
      }).not.toThrow();

      // Test with string label
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
              label="Login Here"
            />
          </TestWrapper>
        );
      }).not.toThrow();

      // Test with React element label
      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
              label={<h1 className="login-title">Welcome</h1>}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle optional callback prop', () => {
      const mockCallback = jest.fn();

      expect(() => {
        render(
          <TestWrapper>
            <LoginPage
              onSubmit={mockOnSubmit}
              isAuthenticated={false}
              onResetPassword="#reset"
              callback={mockCallback}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Component Export Verification', () => {
    it('should export LoginPage as a function', () => {
      expect(typeof LoginPage).toBe('function');
    });

    it('should have the correct function signature', () => {
      expect(LoginPage.length).toBe(1); // Should accept one parameter (props)
    });
  });

  describe('LoginPage Rendering Logic', () => {
    const mockOnSubmit = jest.fn();

    it('should handle authenticated state properly', () => {
      const { container } = render(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={true}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle unauthenticated state properly', () => {
      const { container } = render(
        <TestWrapper>
          <LoginPage
            onSubmit={mockOnSubmit}
            isAuthenticated={false}
            onResetPassword="#reset"
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('RequestPasswordResetPage', () => {
    const mockOnSubmit = jest.fn();
    const mockOnBackToLogin = jest.fn();
    const mockCallback = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be a valid React component', () => {
      expect(typeof RequestPasswordResetPage).toBe('function');
    });

    it('should render without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <RequestPasswordResetPage
              onSubmit={mockOnSubmit}
              onBackToLogin="#login"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render email input field', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument();
    });

    it('should render success alert when success prop is true', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            success={true}
          />
        </TestWrapper>
      );

      expect(screen.getByText('A password reset link has been sent to your email address.')).toBeInTheDocument();
    });

    it('should not render email input when success is true', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            success={true}
          />
        </TestWrapper>
      );

      expect(screen.queryByPlaceholderText('Enter email address')).not.toBeInTheDocument();
    });

    it('should handle string onBackToLogin prop', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="https://example.com/login"
          />
        </TestWrapper>
      );

      const link = screen.getByText('Back to login');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com/login');
    });

    it('should handle function onBackToLogin prop', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin={mockOnBackToLogin}
          />
        </TestWrapper>
      );

      const link = screen.getByText('Back to login');
      expect(link.tagName).toBe('SPAN');
      fireEvent.click(link);
      expect(mockOnBackToLogin).toHaveBeenCalled();
    });

    it('should handle custom label prop', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            label={<h2>Custom Reset Title</h2>}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Custom Reset Title')).toBeInTheDocument();
    });

    it('should disable submit button when email is empty', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Send');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when email is entered', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter email address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByText('Send');
      expect(submitButton).not.toBeDisabled();
    });

    it('should call onSubmit with email when form is submitted', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            callback={mockCallback}
          />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter email address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByText('Send');
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({ email: 'test@example.com' }, mockCallback);
    });

    it('should submit on Enter key press', () => {
      render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter email address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.keyDown(emailInput, { key: 'Enter' });

      expect(mockOnSubmit).toHaveBeenCalledWith({ email: 'test@example.com' }, undefined);
    });

    it('should handle custom colSizes prop', () => {
      const { container } = render(
        <TestWrapper>
          <RequestPasswordResetPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            colSizes={[3, 6, 3]}
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('SetPasswordPage', () => {
    const mockOnSubmit = jest.fn();
    const mockOnBackToLogin = jest.fn();
    const mockCallback = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be a valid React component', () => {
      expect(typeof SetPasswordPage).toBe('function');
    });

    it('should render without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SetPasswordPage
              onSubmit={mockOnSubmit}
              onBackToLogin="#login"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render password and confirm password fields', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    });

    it('should render error alert when error prop is provided', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            error="Invalid reset token"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Invalid reset token')).toBeInTheDocument();
    });

    it('should not render error alert when error is null', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            error={null}
          />
        </TestWrapper>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should handle string onBackToLogin prop', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="https://example.com/login"
          />
        </TestWrapper>
      );

      const link = screen.getByText('Back to login');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com/login');
    });

    it('should handle function onBackToLogin prop', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin={mockOnBackToLogin}
          />
        </TestWrapper>
      );

      const link = screen.getByText('Back to login');
      expect(link.tagName).toBe('SPAN');
      fireEvent.click(link);
      expect(mockOnBackToLogin).toHaveBeenCalled();
    });

    it('should handle custom label prop', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            label={<h2>Create New Password</h2>}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Create New Password')).toBeInTheDocument();
    });

    it('should disable submit button when passwords are empty', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Save');
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when passwords do not match', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'different' } });

      const submitButton = screen.getByText('Save');
      expect(submitButton).toBeDisabled();
    });

    it('should show mismatch error when passwords do not match', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'different' } });

      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
    });

    it('should enable submit button when passwords match', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });

      const submitButton = screen.getByText('Save');
      expect(submitButton).not.toBeDisabled();
    });

    it('should call onSubmit with password when form is submitted', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            callback={mockCallback}
          />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });

      const submitButton = screen.getByText('Save');
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({ password: 'password123' }, mockCallback);
    });

    it('should submit on Enter key press in password field', () => {
      render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
          />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.keyDown(confirmInput, { key: 'Enter' });

      expect(mockOnSubmit).toHaveBeenCalledWith({ password: 'password123' }, undefined);
    });

    it('should handle custom colSizes prop', () => {
      const { container } = render(
        <TestWrapper>
          <SetPasswordPage
            onSubmit={mockOnSubmit}
            onBackToLogin="#login"
            colSizes={[3, 6, 3]}
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeTruthy();
    });
  });
});

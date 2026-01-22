import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { 
  ErrorBoundary, 
  ErrorContext, 
  useError, 
  dispatchError 
} from '../src/components/errors/ErrorBoundary';
import { ErrorPage } from '../src/components/errors/Errors';

describe('Error Components Tests', () => {
  describe('ErrorBoundary', () => {
    it('should render ErrorBoundary without crashing', () => {
      expect(() => {
        render(
          <ErrorBoundary>
            <div>Test Content</div>
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should render children when no error occurs', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should provide error context to children', () => {
      const TestComponent = () => {
        const { error, clearError } = useError();
        return (
          <div>
            <span>Error: {error ? 'Yes' : 'No'}</span>
            <button onClick={clearError}>Clear Error</button>
          </div>
        );
      };

      expect(() => {
        render(
          <ErrorBoundary>
            <TestComponent />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should handle custom error events', () => {
      const TestComponent = () => {
        const { error } = useError();
        return <div>Error State: {error ? 'Error' : 'No Error'}</div>;
      };

      const { getByText } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Initially no error
      expect(getByText('Error State: No Error')).toBeInTheDocument();

      // Dispatch an error
      act(() => {
        dispatchError('Test error');
      });

      // Should show error state
      expect(getByText('Error State: Error')).toBeInTheDocument();
    });

    it('should clear errors when clearError is called', () => {
      const TestComponent = () => {
        const { error, clearError } = useError();
        return (
          <div>
            <span>Error State: {error ? 'Error' : 'No Error'}</span>
            <button onClick={clearError}>Clear</button>
          </div>
        );
      };

      const { getByText, getByRole } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Dispatch an error
      act(() => {
        dispatchError('Test error');
      });

      expect(getByText('Error State: Error')).toBeInTheDocument();

      // Clear the error
      act(() => {
        fireEvent.click(getByRole('button'));
      });

      expect(getByText('Error State: No Error')).toBeInTheDocument();
    });

    it('should be a valid React component', () => {
      expect(typeof ErrorBoundary).toBe('function');
    });
  });

  describe('useError hook', () => {
    it('should provide error context when used within ErrorBoundary', () => {
      const TestComponent = () => {
        const { error, clearError } = useError();
        return (
          <div>
            <span data-testid="error-status">
              {error ? 'Has Error' : 'No Error'}
            </span>
            <button onClick={clearError} data-testid="clear-button">
              Clear
            </button>
          </div>
        );
      };

      expect(() => {
        render(
          <ErrorBoundary>
            <TestComponent />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should return error context functions', () => {
      let contextValue: any;
      
      const TestComponent = () => {
        contextValue = useError();
        return <div>Test</div>;
      };

      render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(contextValue).toBeDefined();
      expect(typeof contextValue.clearError).toBe('function');
      expect(contextValue.error).toBeDefined();
    });
  });

  describe('dispatchError function', () => {
    it('should be a valid function', () => {
      expect(typeof dispatchError).toBe('function');
    });

    it('should dispatch custom events without throwing', () => {
      expect(() => {
        dispatchError('Test error message');
      }).not.toThrow();

      expect(() => {
        dispatchError({ message: 'Test error object' });
      }).not.toThrow();

      expect(() => {
        dispatchError(null);
      }).not.toThrow();
    });
  });

  describe('ErrorContext', () => {
    it('should provide default error context', () => {
      expect(ErrorContext).toBeDefined();
      expect(ErrorContext.Provider).toBeDefined();
      expect(ErrorContext.Consumer).toBeDefined();
    });
  });

  describe('ErrorPage', () => {
    it('should render ErrorPage without crashing', () => {
      expect(() => {
        render(
          <ErrorPage>
            <div>Error Message</div>
          </ErrorPage>
        );
      }).not.toThrow();
    });

    it('should render children content', () => {
      const { getByText } = render(
        <ErrorPage>
          <h1>Something went wrong</h1>
          <p>Please try again later</p>
        </ErrorPage>
      );

      expect(getByText('Something went wrong')).toBeInTheDocument();
      expect(getByText('Please try again later')).toBeInTheDocument();
    });

    it('should handle different types of children', () => {
      expect(() => {
        render(
          <ErrorPage>
            <div>Text content</div>
          </ErrorPage>
        );
      }).not.toThrow();

      expect(() => {
        render(
          <ErrorPage>
            {['Multiple', 'text', 'elements']}
          </ErrorPage>
        );
      }).not.toThrow();

      expect(() => {
        render(
          <ErrorPage>
            <span>Single element</span>
          </ErrorPage>
        );
      }).not.toThrow();
    });

    it('should apply proper styling structure', () => {
      const { container } = render(
        <ErrorPage>
          <div>Content</div>
        </ErrorPage>
      );

      // Should have container structure
      expect(container.firstChild).toBeTruthy();
    });

    it('should be a valid React component', () => {
      expect(typeof ErrorPage).toBe('function');
    });
  });

  describe('Error Handling Integration', () => {
    it('should work together - ErrorBoundary with ErrorPage', () => {
      const TestErrorPage = () => {
        const { error } = useError();
        
        if (error) {
          return (
            <ErrorPage>
              <h2>An error occurred</h2>
              <p>{error.toString()}</p>
            </ErrorPage>
          );
        }
        
        return <div>Normal content</div>;
      };

      expect(() => {
        render(
          <ErrorBoundary>
            <TestErrorPage />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should handle error lifecycle correctly', () => {
      const TestComponent = () => {
        const { error, clearError } = useError();
        
        return (
          <div>
            {error ? (
              <ErrorPage>
                <div>
                  <span>Error occurred: {error}</span>
                  <button onClick={clearError}>Retry</button>
                </div>
              </ErrorPage>
            ) : (
              <div>
                <span>All good</span>
                <button onClick={() => dispatchError('Test error')}>
                  Trigger Error
                </button>
              </div>
            )}
          </div>
        );
      };

      const { getByText, queryByText } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Initially no error
      expect(getByText('All good')).toBeInTheDocument();

      // Trigger error
      act(() => {
        fireEvent.click(getByText('Trigger Error'));
      });

      // Should show error page
      expect(getByText('Error occurred: Test error')).toBeInTheDocument();

      // Clear error
      act(() => {
        fireEvent.click(getByText('Retry'));
      });

      // Should return to normal state
      expect(getByText('All good')).toBeInTheDocument();
      expect(queryByText('Error occurred: Test error')).not.toBeInTheDocument();
    });
  });

  describe('Component Export Verification', () => {
    it('should export all error components as functions', () => {
      expect(typeof ErrorBoundary).toBe('function');
      expect(typeof ErrorPage).toBe('function');
      expect(typeof useError).toBe('function');
      expect(typeof dispatchError).toBe('function');
    });
  });
});

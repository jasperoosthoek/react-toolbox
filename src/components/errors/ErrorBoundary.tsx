import React, { useState, useEffect, useContext, ReactNode } from 'react';

export const dispatchError = (error: any) => {
  const event = new CustomEvent('customError', { detail: error });
  window.dispatchEvent(event);
}

interface ErrorContextType {
  error: any | null;
  clearError: () => void;
}

const out_of_context_error = 'The useError hook should only be used in a child of the ErrorBoundary component.';

const defaultErrorState: ErrorContextType = {
  error: out_of_context_error,
  clearError: () => console.error(out_of_context_error),
};

export const ErrorContext = React.createContext(defaultErrorState);

export const useError = () => useContext(ErrorContext);

interface ErrorBoundaryProps {
  children: ReactNode;
}
  
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const handleError = (event: Event) => {
      const customEvent = event as CustomEvent<Error>;
      const error = customEvent.detail;
      setError(error);
    };
    window.addEventListener('customError', handleError);

    return () => window.removeEventListener('customError', handleError);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error,
        clearError: () => setError(null),
      }}>
      {children}
    </ErrorContext.Provider>
  );
};

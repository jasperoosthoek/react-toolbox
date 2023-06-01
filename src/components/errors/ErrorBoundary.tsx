import React, { useState, useEffect, useContext, ReactNode } from 'react';

export const dispatchError = (error: any) => {
  const event = new CustomEvent('customError', { detail: error });
  window.dispatchEvent(event);
}

interface ErrorContextType {
  error: any | null;
  clearError: () => void;
}

const out_of_context_error = 'This component should only be used as a child of ErrorBoundary.';

const defaultErrorState: ErrorContextType = {
  error: null,
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

    console.log('addEventListener')
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

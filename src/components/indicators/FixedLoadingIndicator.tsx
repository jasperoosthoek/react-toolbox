import React from 'react';

interface FixedLoadingIndicatorProps {
  show: boolean;
  message: string;
  variant?: 'info' | 'warning' | 'success' | 'danger' | 'primary' | 'secondary';
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export const FixedLoadingIndicator: React.FC<FixedLoadingIndicatorProps> = ({
  show,
  message,
  variant = 'info',
  position = { top: '20px', right: '20px' },
  className = '',
  style = {}
}) => {
  if (!show) return null;

  const defaultStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1050,
    minWidth: '250px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    ...position,
    ...style
  };

  return (
    <div 
      className={`alert alert-${variant} ${className}`}
      style={defaultStyle}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        {message}
      </div>
    </div>
  );
};

export default FixedLoadingIndicator;

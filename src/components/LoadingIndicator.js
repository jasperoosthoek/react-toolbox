import React, { useContext } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { LocalizationContext } from '../localization/LocalizationContext';

export const LoadingIndicator = ({ style = {}}) => {
  const { strings } = useContext(LocalizationContext);
  return (
    <Spinner animation="border" role="status" style={style}>
      <span className="sr-only">{strings.information_is_being_loaded}</span>
    </Spinner>
  );
};

export const SmallSpinner = ({ style = {}, component: Component = Button, className }) => (
  Component
    ? <Component
        className={className}
        variant="link"
        disabled
        size="sm"
        style={style}
      >
        <Spinner animation="border" role="status" size="sm" />
      </Component>
    : <Spinner className={className} animation="border" role="status" size="sm" />
);

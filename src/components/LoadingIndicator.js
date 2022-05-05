import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

export default ({ style = {}}) => (
  <Spinner animation="border" role="status" style={style}>
    <span className="sr-only">De gegevens worden geladen...</span>
  </Spinner>
);

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

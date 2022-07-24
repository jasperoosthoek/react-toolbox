import React, { useContext } from 'react';
import { Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import { LocalizationContext } from '../localization/LocalizationContext';

export const LoadingIndicator = ({ style = {}}) => {
  const { strings } = useContext(LocalizationContext);
  return (
    
    <Container>
      <Row className="error-page">
        <Col>
          <div
            // Bootstrap 5 legacy jumbotron 
            style={{
              padding: '2rem 1rem',
              marginBottom: '2rem',
              backgroundColor: '#e9ecef',
              borderRadius: '.3rem',
            }}
          >
            <Spinner animation="border" role="status" style={{ marginRight: '20px', ...style }} />
            {strings.information_is_being_loaded}
          </div>
        </Col>
      </Row>
    </Container>
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

export const BigSpinner = () => (
  <Spinner animation="border" role="status" />
);

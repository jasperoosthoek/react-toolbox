import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

export type ErrorPageProps = {
  children: any;
}

export const ErrorPage = ({ children }: ErrorPageProps) =>
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
          {children}
        </div>
      </Col>
    </Row>
  </Container>;

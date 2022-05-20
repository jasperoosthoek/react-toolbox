import { Row, Col, Container } from 'react-bootstrap';

export const ErrorPage = ({ children }) =>
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

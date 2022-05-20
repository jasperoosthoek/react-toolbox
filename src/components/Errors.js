
import { Row, Col, Container, Jumbotron } from 'react-bootstrap';

export const ErrorPage = ({ children }) =>
  <Container>
    <Row className="error-page">
      <Col>
        <Jumbotron>
          {children}
        </Jumbotron>
      </Col>
    </Row>
  </Container>;

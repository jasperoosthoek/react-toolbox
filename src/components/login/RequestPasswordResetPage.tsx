import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useSetState } from '../../utils/hooks';
import { useLocalization } from '../../localization/LocalizationContext';

export type RequestPasswordResetPageProps = {
  onSubmit: (data: { email: string }, callback?: () => void) => void;
  callback?: () => void;
  onBackToLogin: string | (() => void);
  label?: string | React.ReactElement;
  success?: boolean;
  colSizes?: [number, number, number];
};

export const RequestPasswordResetPage = ({
  onSubmit,
  callback,
  onBackToLogin,
  label,
  success = false,
  colSizes = [2, 8, 2],
}: RequestPasswordResetPageProps) => {
  const [state, setState] = useSetState({ email: '' });
  const { strings } = useLocalization();
  const submitDisabled = !state.email;

  const handleSubmit = () => {
    if (!submitDisabled) onSubmit(state, callback);
  };

  return (
    <Container>
      <Row className="request-password-reset">
        <Col md={colSizes[0]} />
        <Col md={colSizes[1]}>
          {label || <h1>{strings.getString('reset_password')}</h1>}
          {success ? (
            <>
              <Alert variant="success">
                {strings.getString('reset_link_sent')}
              </Alert>
              <p>
                {typeof onBackToLogin === 'string'
                  ? <a href={onBackToLogin}>{strings.getString('back_to_login')}</a>
                  : <span onClick={onBackToLogin} className="back-to-login" >
                      {strings.getString('back_to_login')}
                    </span>
                }
              </p>
            </>
          ) : (
            <>
              <p>{strings.getString('enter_email_for_reset')}</p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>{strings.getString('your_email')}</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={state.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setState({ email: e.target.value })
                    }
                    placeholder={strings.getString('enter_email')}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      e.key === 'Enter' && handleSubmit()
                    }
                  />
                </Form.Group>
              </Form>
              <Button onClick={handleSubmit} disabled={submitDisabled}>
                {strings.getString('send')}
              </Button>
              <p className="mt-2">
                {typeof onBackToLogin === 'string'
                  ? <a href={onBackToLogin}>{strings.getString('back_to_login')}</a>
                  : <span onClick={onBackToLogin} className="back-to-login" >
                      {strings.getString('back_to_login')}
                    </span>
                }
              </p>
            </>
          )}
        </Col>
        <Col md={colSizes[2]} />
      </Row>
    </Container>
  );
};

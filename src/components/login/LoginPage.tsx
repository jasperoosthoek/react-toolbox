import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import { useSetState } from '../../utils/hooks';
import { useLocalization } from '../../localization/LocalizationContext';

export type LoginPageProps = {
  onSubmit: (credentials: { email: string; password: string }, callback?: () => void) => void;
  callback?: () => void;
  isAuthenticated: boolean;
  label?: string | React.ReactElement;
  onResetPassword: string | (() => void);
};

export const LoginPage = ({
  onSubmit,
  isAuthenticated,
  label,
  onResetPassword,
  callback,
}: LoginPageProps) => {
  const [state, setState] = useSetState({ email: '', password: '' });
  const { strings } = useLocalization();
  const submitDisabled = !state.email || !state.password;

  const handleSubmit = () => {
    if (!submitDisabled) onSubmit(state, callback);
  };

  if (isAuthenticated) return null;

  return (
    <Container>
      <Row className="login">
        <Col md={2} />
        <Col md={8}>
          {label || <h1>{strings.getString('login')}</h1>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{strings.getString('your_email')}</Form.Label>
              <Form.Control
                name="email"
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
            <Form.Group className="mb-3">
              <Form.Label>{strings.getString('your_password')}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={state.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setState({ password: e.target.value })
                }
                placeholder={strings.getString('enter_password')}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  e.key === 'Enter' && handleSubmit()
                }
              />
            </Form.Group>
          </Form>
          <Button onClick={handleSubmit} disabled={submitDisabled}>
            {strings.getString('login')}
          </Button>
          <p className="mt-2">
            {strings.getString('forgot_password')}{' '}
            {typeof onResetPassword === 'string' 
              ? <a href={onResetPassword}>{strings.getString('reset_password')}</a>
              : <span
                  onClick={onResetPassword}
                  className='reset-password'
                >
                  {strings.getString('reset_password')}
                </span>
            }
          </p>
        </Col>
        <Col md={2} />
      </Row>
    </Container>
  );
};
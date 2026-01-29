import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useSetState } from '../../utils/hooks';
import { useLocalization } from '../../localization/LocalizationContext';

export type SetPasswordPageProps = {
  onSubmit: (data: { password: string }, callback?: () => void) => void;
  callback?: () => void;
  onBackToLogin: string | (() => void);
  label?: string | React.ReactElement;
  error?: string | null;
  colSizes?: [number, number, number];
};

export const SetPasswordPage = ({
  onSubmit,
  callback,
  onBackToLogin,
  label,
  error = null,
  colSizes = [2, 8, 2],
}: SetPasswordPageProps) => {
  const [state, setState] = useSetState({ password: '', confirmPassword: '' });
  const { strings } = useLocalization();

  const passwordsMatch = state.password === state.confirmPassword;
  const submitDisabled = !state.password || !state.confirmPassword || !passwordsMatch;

  const handleSubmit = () => {
    if (!submitDisabled) onSubmit({ password: state.password }, callback);
  };

  return (
    <Container>
      <Row className="set-password">
        <Col md={colSizes[0]} />
        <Col md={colSizes[1]}>
          {label || <h1>{strings.getString('set_new_password')}</h1>}
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{strings.getString('new_password')}</Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label>{strings.getString('confirm_password')}</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setState({ confirmPassword: e.target.value })
                }
                placeholder={strings.getString('confirm_password')}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  e.key === 'Enter' && handleSubmit()
                }
                isInvalid={state.confirmPassword.length > 0 && !passwordsMatch}
              />
              {state.confirmPassword.length > 0 && !passwordsMatch && (
                <Form.Text className="text-danger">
                  {strings.getString('passwords_must_match')}
                </Form.Text>
              )}
            </Form.Group>
          </Form>
          <Button onClick={handleSubmit} disabled={submitDisabled}>
            {strings.getString('save')}
          </Button>
          <p className="mt-2">
            {typeof onBackToLogin === 'string'
              ? <a href={onBackToLogin}>{strings.getString('back_to_login')}</a>
              : <span onClick={onBackToLogin} className="back-to-login" >
                  {strings.getString('back_to_login')}
                </span>
            }
          </p>
        </Col>
        <Col md={colSizes[2]} />
      </Row>
    </Container>
  );
};

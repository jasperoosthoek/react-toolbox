import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';

import { useSetState, useWithDispatch } from '../utils/Hooks';
import { LocalizationContext } from '../localization/LocalizationContext';
import { isEmpty } from '../utils/Utils';

export const LOGIN_SET_TOKEN = 'LOGIN_SET_TOKEN';
export const LOGIN_SET_CURRENT_USER = 'LOGIN_SET_CURRENT_USER';
export const LOGIN_UNSET_CURRENT_USER = 'LOGIN_UNSET_CURRENT_USER';

const errorIfUndefined = obj => Object.entries(obj).reduce((error, [param, value]) => {
  if (typeof value === 'undefined') {
    console.error(`Parameter ${param} of loginFactory cannot be undefined`);
  }
  return error;
}, false)
export const loginFactory = ({
  authenticatedComponent,
  passwordResetUrl,
  axios,
  onError = () => {},
  onLogout = () => {},
  loginUrl,
  getUserUrl,
  logoutUrl,
  localStoragePrefix,
}) => {
  const localStorageUser = localStoragePrefix ? `${localStoragePrefix}-user` : 'user';
  const localStorageToken = localStoragePrefix ? `${localStoragePrefix}-token` : 'token';

  const error = errorIfUndefined({
    authenticatedComponent,
    passwordResetUrl,
    axios,
    loginUrl,
    getUserUrl,
    logoutUrl,
  });
  if (error) return;
  const AuthenticatedComponent = authenticatedComponent;

  const login = userData => async dispatch => {
    try {
      const response = await axios.post(loginUrl, userData);
      const { auth_token } = response.data;
      dispatch(setToken(auth_token));
      dispatch(getCurrentUser());
    } catch(error) {
      dispatch(unsetCurrentUser());
      onError(error);
    };
  };

  const setAxiosAuthToken = token => {
    if (typeof token !== 'undefined' && token) {
      // Apply for every request
      axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    } else {
      // Delete auth header
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  
  const getCurrentUser = () => async dispatch => {
    try {
      const response = await axios.get(getUserUrl);
      const user = response.data;
      dispatch(setCurrentUser(user));
    } catch(error) {
      dispatch(unsetCurrentUser());
      if (error.response) {
        if (
          error.response.status === 401 &&
          error.response.hasOwnProperty('data') &&
          error.response.data.hasOwnProperty('detail') &&
          error.response.data['detail'] === 'User inactive or deleted.'
        ) {
        }
      } else {
        onError(error);
      }
    };
  };
  
  const setCurrentUser = (user) => dispatch => {
    localStorage.setItem(localStorageUser, JSON.stringify(user));
    dispatch({
      type: LOGIN_SET_CURRENT_USER,
      payload: user,
    });
  };
  
  const setToken = token => dispatch => {
    setAxiosAuthToken(token);
    localStorage.setItem(localStorageToken, token);
    dispatch({
      type: LOGIN_SET_TOKEN,
      payload: token,
    });
  };
  
  const unsetCurrentUser = () => dispatch => {
    setAxiosAuthToken('');
    localStorage.removeItem(localStorageToken);
    localStorage.removeItem(localStorageUser);
    dispatch({
      type: LOGIN_UNSET_CURRENT_USER
    });
  };
  
  const logout = () => async dispatch => {
    try {
      await axios.post(logoutUrl);
      dispatch(unsetCurrentUser());
      onLogout();
    } catch(error) {
      dispatch(unsetCurrentUser());
      onError(error);
    };
  };
  
  const useLogin = () => useWithDispatch({
    login,
    getCurrentUser,
    setCurrentUser,
    setToken,
    unsetCurrentUser,
    logout,
  })

  const token = localStorage.getItem(localStorageToken);
  const user = localStorage.getItem(localStorageUser);
  const hasLocalStorage = !isEmpty(user) && !isEmpty(token);
  const initialState = {
    ...hasLocalStorage
    ? {
      isAuthenticated: true,
      user: JSON.parse(user),
      token,
    }
    : {
        isAuthenticated: false,
        user: {},
        token: ''
      },
  };
  if (hasLocalStorage) {
    setAxiosAuthToken(token);
  }

  const authReducer = {
    auth:
      (state = initialState, action) => {
        switch (action.type) {
          case LOGIN_SET_TOKEN:
            return {
              ...state,
              isAuthenticated: true,
              token: action.payload,
            };
          case LOGIN_SET_CURRENT_USER:
            return {
              ...state,
              user: action.payload,
            };
          case LOGIN_UNSET_CURRENT_USER:
            return initialState;
          default:
            return state;
        }
      },
  };
  const useAuth = () => {
    return useSelector(state => state.auth);
  }
  const Login = () => {
    const [state, setState] = useSetState({
      email: '',
      password: ''
    });
    const isAuthenticated = useSelector(({ auth }) => auth.isAuthenticated );
    const { login } = useLogin();
    const { strings } = useContext(LocalizationContext);
  
    const onChange = e => {
      setState({ [e.target.name]: e.target.value });
    };
    const onLoginClick = () => {
      const userData = {
        email: state.email,
        password: state.password
      };
      login(userData);
    };
  
    if (isAuthenticated) {
      return <AuthenticatedComponent />
    }
    return (
      <Container>
        <Row className="login">
          <Col md='2'>
          </Col>
          <Col md='8'>
            <h1>Login</h1>
            <Form>
              <Form.Group className="mb-3" controlId='emailId'>
                <Form.Label>{strings.your_email}</Form.Label>
                <Form.Control
                  type='text'
                  name='email'
                  placeholder='Enter email'
                  value={state.email}
                  onChange={onChange}
                />
              </Form.Group>
  
              <Form.Group className="mb-3" controlId='passwordId'>
                <Form.Label>{strings.your_password}</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder={strings.enter_password}
                  value={state.password}
                  onChange={onChange}
                />
              </Form.Group>
            </Form>
            <Button variant='primary' onClick={onLoginClick}>
              {strings.login}
            </Button>
            <p className='mt-2'>
            {strings.forgot_password}{' '}
              <a href={passwordResetUrl}>{strings.reset_password}</a>
            </p>
          </Col>
          <Col md='2'>
          </Col>
        </Row>
      </Container>
    );
  };
  
  return {
    Login,
    useLogin,
    login,
    getCurrentUser,
    setCurrentUser,
    setToken,
    unsetCurrentUser,
    logout,
    authReducer,
    useAuth,
  }
}


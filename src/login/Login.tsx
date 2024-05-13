import React, { ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';

import { useSetState, useWithDispatch } from '../utils/hooks';
import { useLocalization } from '../localization/LocalizationContext';
import { isEmpty } from '../utils/utils';

export const LOGIN_SET_TOKEN = 'LOGIN_SET_TOKEN';
export const LOGIN_SET_CURRENT_USER = 'LOGIN_SET_CURRENT_USER';
export const LOGIN_UNSET_CURRENT_USER = 'LOGIN_UNSET_CURRENT_USER';

const useThunkDispatch = () => {
  const store = useStore();
  const dispatch = useDispatch<typeof store.dispatch>();
  return dispatch;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: any | null;
  token: string;
}

type Action = {
  type: string,
  [key: string]: any,
}
export type LoginFactoryProps = {
  authenticatedComponent: (props: any) => ReactElement;
  passwordResetUrl: string;
  axios: typeof axios | AxiosInstance;
  onError: (error: any) => void;
  onLogout?: () => void;
  loginUrl: string;
  getUserUrl: string;
  logoutUrl: string;
  localStoragePrefix: string;
};

export type LoginProps = {
  label?: string | ReactElement;
};
const errorIfUndefined = (obj: Partial<LoginFactoryProps>) => Object.entries(obj).reduce((error, [param, value]) => {
  if (typeof value === 'undefined') {
    console.error(`Parameter ${param} of loginFactory cannot be undefined`);
  }
  return error;
}, false);

export const loginFactory = ({
  authenticatedComponent,
  passwordResetUrl,
  axios,
  onError = () => {},
  onLogout,
  loginUrl,
  getUserUrl,
  logoutUrl,
  localStoragePrefix,
}: LoginFactoryProps) => {

  const localStorageUser = localStoragePrefix ? `${localStoragePrefix}-user` : 'user';
  const localStorageToken = localStoragePrefix ? `${localStoragePrefix}-token` : 'token';
  const localStorageState = localStoragePrefix ? `${localStoragePrefix}-state` : 'state';
  
  errorIfUndefined({
    authenticatedComponent,
    passwordResetUrl,
    axios,
    loginUrl,
    getUserUrl,
    logoutUrl,
  });

  const AuthenticatedComponent = authenticatedComponent;

  const login = (userData: any, callback?: () => void) => async (dispatch: ThunkDispatch<any, undefined, any>) => {
    try {
      const response = await axios.post(loginUrl, userData);
      const { auth_token } = response.data;
      dispatch(setToken(auth_token));
      dispatch(getCurrentUser());
      if (typeof callback === 'function') callback();
    } catch(error) {
      dispatch(unsetCurrentUser());
      onError(error);
    };
  };

  const setAxiosAuthToken = (token: string) => {
    if (typeof token !== 'undefined' && token) {
      // Apply for every request
      axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    } else {
      // Delete auth header
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  
  const getCurrentUser = ({ callback }: { callback?: (userData: any) => void} = {}) => async (dispatch: ThunkDispatch<any, undefined, any>) => {
    try {
      const response = await axios.get(getUserUrl) as AxiosResponse;
      dispatch(setCurrentUser(response.data));
      if (typeof callback === 'function') callback(response.data);

    } catch(error) {
      dispatch(unsetCurrentUser());
      onError(error);
    };
  };
  
  const setCurrentUser = (user: any) => (dispatch: ThunkDispatch<any, undefined, any>) => {
    localStorage.setItem(localStorageUser, JSON.stringify(user));
    dispatch({
      type: LOGIN_SET_CURRENT_USER,
      payload: user,
    });
  };
  
  const setToken = (token: string) => (dispatch: ThunkDispatch<any, undefined, any>) => {
    setAxiosAuthToken(token);
    localStorage.setItem(localStorageToken, token);
    dispatch({
      type: LOGIN_SET_TOKEN,
      payload: token,
    });
  };
  
  const unsetCurrentUser = () => (dispatch: ThunkDispatch<any, undefined, any>) => {
    setAxiosAuthToken('');
    localStorage.removeItem(localStorageToken);
    localStorage.removeItem(localStorageUser);
    localStorage.removeItem(localStorageState);
    dispatch({
      type: LOGIN_UNSET_CURRENT_USER
    });
  };
  
  const logout = () => async (dispatch: ThunkDispatch<any, undefined, any>) => {
    try {
      await axios.post(logoutUrl);
      dispatch(unsetCurrentUser());
      if (typeof onLogout === 'function') onLogout();
    } catch(error) {
      dispatch(unsetCurrentUser());
      onError(error);
    };
  };
  
  const useLogin = () => {
    return (
      {
        login: useWithDispatch(login),
        getCurrentUser: useWithDispatch(getCurrentUser),
        setCurrentUser: useWithDispatch(setCurrentUser),
        setToken: useWithDispatch(setToken),
        unsetCurrentUser: useWithDispatch(unsetCurrentUser),
        logout: useWithDispatch(logout),
      }
    );
  }

  const token = localStorage.getItem(localStorageToken);
  const user = localStorage.getItem(localStorageUser);

  const hasLocalStorage = !isEmpty(user) && !isEmpty(token);
  const initialState = {
    ...hasLocalStorage
    ? {
      isAuthenticated: true,
      user: user ? JSON.parse(user) : null,
      token,
    }
    : {
        isAuthenticated: false,
        user: null,
        token: ''
      },
  } as AuthState;
  if (hasLocalStorage && token) {
    setAxiosAuthToken(token);
  }

  const authReducer = {
    auth:
      (state = initialState, action: Action) => {
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
    return useSelector((state: any) => state.auth);
  }
  const Login = ({ label }: LoginProps) => {
    const [state, setState] = useSetState({
      email: '',
      password: ''
    });
    const isAuthenticated = useSelector(({ auth }: any) => auth.isAuthenticated );
    const dispatch = useDispatch();
    const { strings } = useLocalization();
  
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      setState({ [e.target.name]: e.target.value });
    };
    const submitDisabled = !state.email || !state.password;
    const onLoginClick = () => {
      if (submitDisabled) return;
      const userData = {
        email: state.email,
        password: state.password
      };
      dispatch(login(userData));
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
            {label || <h1>{strings.getString('login')}</h1>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>{strings.getString('your_email')}</Form.Label>
                <Form.Control
                  type='text'
                  name='email'
                  placeholder={strings.getString('enter_email')}
                  value={state.email}
                  onChange={onChange}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!submitDisabled) onLoginClick();
                    }
                  }}
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>{strings.getString('your_password')}</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder={strings.getString('enter_password')}
                  value={state.password}
                  onChange={onChange}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!submitDisabled) onLoginClick();
                    }
                  }}
                />
              </Form.Group>
            </Form>
            <Button
              variant='primary'
              onClick={onLoginClick}
              disabled={submitDisabled}
            >
              {strings.getString('login')}
            </Button>
            <p className='mt-2'>
              {strings.getString('forgot_password')}{' '}
              <a href={passwordResetUrl}>{strings.getString('reset_password')}</a>
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
    storeState: (state: any, action: Action) => {
      if (action.type === LOGIN_UNSET_CURRENT_USER) {
        localStorage.removeItem(localStorageState);
      } else {
        localStorage.setItem(localStorageState, JSON.stringify(state));
      }
    },
    retrieveState: () => {
      const state = localStorage.getItem(localStorageState);
      if (!state) return {};
      return JSON.parse(state);
    },
  }
}


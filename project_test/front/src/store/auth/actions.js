export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT = 'LOGOUT';
export const SET_ERROR = 'SET_ERROR';

export const login = (user) => ({
  type: LOGIN,
  payload: user,
});

export const loginSuccess = (token) => ({
  type: LOGIN_SUCCESS,
  payload: token,
});

export const loginFailed = () => ({
  type: LOGIN_FAILED,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setError = (error) => ({
  type: LOGOUT,
  payload: error,
});

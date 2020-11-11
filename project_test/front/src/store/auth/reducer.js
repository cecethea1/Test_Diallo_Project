import {
  LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, SET_ERROR,
} from './actions';
import api from '../api';
import { getToken } from '../../utils/user';

const initialState = {
  email: '',
  firstname: '',
  lastname: '',
  ...getToken(),
  loading: false,
  isLogged: !!getToken().token,
  error: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      localStorage.removeItem('token');
      return { ...state, loading: true };

    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state, token: action.payload.token, loading: false, isLogged: true,
      };

    case LOGIN_FAILED:
      return {
        ...state, token: null, loading: false, isLogged: false, error: action.payload,
      };

    case LOGOUT:
      localStorage.clear();
      return {
        ...state, token: null, loading: false, isLogged: false, error: null,
      };

    case SET_ERROR:
      return {
        ...state, error: action.payload,
      };

    default:
      return state;
  }
}


export const LogInAsync = (user) => async (dispatch) => {
  dispatch({ type: LOGIN });
  try {
    const response = await api.post('/users/login', user);
    if (response.status === 200) {
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: LOGIN_FAILED, payload: 'Connection Failed' });
    }
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error });
  }
};

export const LogOutAsync = (history) => async (dispatch) => {
  try {
    await api.post('/users/logout');
    dispatch({ type: LOGOUT });
    history.go(0);
  } catch (error) {
    dispatch({ type: LOGOUT });
    history.go(0);
  }
};

/* eslint-disable import/prefer-default-export */
import * as jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../store/auth/actions';

export const useAuth = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (token) {
    const decoded = jwtDecode(token);
    if (Date.now() < decoded.exp * 1000) {
      return true;
    }
    dispatch({ type: LOGOUT });
  }
  return false;
};

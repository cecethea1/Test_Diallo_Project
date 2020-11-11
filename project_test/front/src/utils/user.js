import api from '../store/api';

const jwt = require('jsonwebtoken');

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = jwt.decode(token);
    return { token, user, isConnected: true };
  }
  return { isConnected: false };
};

export const logout = async () => {
  await api.post('/users/logout');
  localStorage.clear();
};

export const set = (token) => {
  try {
    localStorage.setItem('token', token);
    const user = jwt.decode(token);
    return { token, user, isConnected: true };
  } catch (err) {
    throw (new Error('Cannot decode token'));
  }
};

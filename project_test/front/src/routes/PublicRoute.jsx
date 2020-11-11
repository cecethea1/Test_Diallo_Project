import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/useAuth';

const PublicRoute = ({ component: Component, ...rest }) => {
  // restricted = false meaning public route
  // restricted = true meaning restricted route
  const isLogin = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => (
        isLogin
          ? <Redirect to="/" />
          : <Component {...props} />
      )}
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PublicRoute;

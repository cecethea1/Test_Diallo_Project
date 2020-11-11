import React from 'react';
import PropTypes from 'prop-types';
import {
  Redirect, Route, useLocation, matchPath,
} from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import routes from '.';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const isLogin = useAuth();
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /login page
  let isRoute = false;
  const paths = routes.map((route) => route.path);
  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    const matched = matchPath(location.pathname, { path });
    if (matched && matched.isExact && matched.path !== '*') {
      isRoute = true;
    }
  }
  return (
    <Route
      {...rest}
      render={(props) => ((isLogin && isRoute) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      ))}
    />
  );
};


PrivateRoute.propTypes = {
  isHome: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

PrivateRoute.defaultProps = {
  isHome: false,
};

export default PrivateRoute;

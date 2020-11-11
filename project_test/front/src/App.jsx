import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import {
  ThemeProvider,
} from '@material-ui/core';
import routes from './routes';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import HeaderMenu from './components/Menu';
import theme from './utils/theme';
import ProjectsDialog from './components/ProjectsDialog';
import { SET_NOTIFICATIONS } from './store/alert/actions';

// import NotFound from './routes/notfound/NotFound';

export default function App() {
  const { isLogged } = useSelector((state) => state.auth);
  const { currentProject, projects } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const initChannel = () => {
    const messageChannel = new MessageChannel();
    // First we initialize the channel by sending
    // the port to the Service Worker (this also
    // transfers the ownership of the port)
    if ('serviceWorker' in navigator) {
      if ('controller' in navigator.serviceWorker) {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'INIT_PORT',
          }, [messageChannel.port2]);
          // Listen to the response
          messageChannel.port1.onmessage = (event) => {
            // TODO: refresh data with new notification alerts
            dispatch({ type: SET_NOTIFICATIONS, payload: true });
            console.log(event.data.payload);
          };
        }
      }
    }
  };
  initChannel();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isLogged && <HeaderMenu />}
        {isLogged && !currentProject && (
          <ProjectsDialog projects={projects} />
        )}
        <Switch>
          {routes.map(({
            path, exact, component, privateRoute,
          }) => (
            privateRoute ? (
              <PrivateRoute
                exact={exact}
                key={path}
                component={component}
                path={path}
              />
            ) : (
              <PublicRoute
                exact={exact}
                key={path}
                component={component}
                path={path}
              />
            )))}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

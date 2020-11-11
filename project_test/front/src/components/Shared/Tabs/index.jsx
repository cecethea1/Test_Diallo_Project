import {
  AppBar, makeStyles, Tab, Tabs,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import './style.scss';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

function TabsMenu({ routes }) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const matchPath = () => (routes.filter((route) => route.menu).map((r) => (r.path)).includes(location.pathname) ? location.pathname : '/');
  const [value, setValue] = useState(matchPath());
  const selectTab = (route) => {
    history.push(route);
  };

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <AppBar style={{ marginTop: '65px' }} position="fixed" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs"
        >
          {
            routes
              .filter((route) => route.menu)
              .map((route) => (
                <Tab
                  onClick={() => selectTab(route.path)}
                  value={route.path}
                  key={route.path}
                  label={route.title}
                  icon={route.icon}
                  wrapped
                />
              ))
          }
        </Tabs>
      </AppBar>
    </div>
  );
}

TabsMenu.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.any).isRequired,
};
export default TabsMenu;

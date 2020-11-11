import React from 'react';
import {
  Box, Grow, makeStyles, Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '110px',
    position: 'relative',
    minHeight: '100vh',
  },
  container: {
    position: 'relative',
    padding: '50px 50px 50px 50px',
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px`,
    },
  },
}));
const PageContainer = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <Grow {...rest} in>
      <Paper elevation={4} className={classes.root}>
        <Box className={classes.container}>{children}</Box>
      </Paper>
    </Grow>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PageContainer;

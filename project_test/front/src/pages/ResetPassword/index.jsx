/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
  Button,
  Collapse, Grid, InputAdornment, Link, makeStyles, Paper, TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Lock as LockIcon } from '@material-ui/icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as jwtDecode from 'jwt-decode';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../store/api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 20,
    [theme.breakpoints.down('xs')]: {
      margin: 10,
    },
  },
  image: {
    minHeight: '100vh',
    width: '100%',
    height: '100%',
    background: 'transparent linear-gradient(218deg, #153376 0%, #3B86FF 100%) 0% 0% no-repeat padding-box',
    opacity: 1,
  },
  paper: {
    padding: '50px',
    textAlign: 'center',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      padding: '10px',
    },
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
export default function ResetPassword(props) {
  const { match } = props;
  const classes = useStyles();
  const { token } = match.params;
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState();

  const history = useHistory();
  let decoded = null;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    return <Redirect to="/login" />;
  }

  if (Date.now() > decoded.exp * 1000) {
    return <Redirect to="/lgin" />;
  }
  const headers = {
    Authorization: token,
  };

  const changePassword = async (password) => {
    try {
      const res = await api.post('/users/changepassword', { password }, { headers });
      if (res.status === 200) {
        setIsChanged(true);
      } else {
        setError('Failed to reset password');
      }
    } catch (err) {
      console.log({ err });
      setError(err.response.data);
    }
  };

  const schema = yup.object({
    password: yup.string().required('You need to enter a password')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/,
        'Must Contain more than 4 Characters,\n One Uppercase, One Lowercase,\n One Number and one special case Character').required(),
    otherPassword: yup.string().oneOf([yup.ref('password'), null], 'password must match').required('Verification Required'),
  });

  return (
    <Grid container>
      <Grid item lg={6} xs={false}>
        <div className={classes.image} />
      </Grid>
      <Grid item lg={6} xs={12} className={classes.container}>
        <Paper elevation={1} className={classes.paper}>
          {!isChanged && (
            <>
              <Collapse in={!!error}>
                <Alert onClose={() => setError(false)} severity="error">
                  <strong>{error}</strong>
                </Alert>
              </Collapse>
              <div>
                <h1>Enter your new password</h1>
              </div>
              <Formik
                validationSchema={schema}
                onSubmit={(values) => changePassword(values.password)}
                initialValues={{ password: '', otherPassword: '' }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  errors,
                }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container>
                      <Grid item xs={12}>
                        <div className={classes.formControl}>
                          <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="New Password"
                            helperText={touched.password ? errors.password : ''}
                            error={touched.password && Boolean(errors.password)}
                            fullWidth
                            value={values.password}
                            onChange={handleChange}
                            InputProps={{
                              autoComplete: 'nope',
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                        <div className={classes.formControl}>
                          <TextField
                            id="otherPassword"
                            name="otherPassword"
                            type="password"
                            label="New password again"
                            helperText={touched.otherPassword ? errors.otherPassword : ''}
                            error={touched.otherPassword && Boolean(errors.otherPassword)}
                            fullWidth
                            value={values.otherPassword}
                            onChange={handleChange}
                            InputProps={{
                              autoComplete: 'nope',
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <div className={classes.formControl}>
                      <Button type="submit" size="large" variant="contained" fullWidth color="primary">
                        Change Password
                      </Button>
                    </div>
                    <div className={classes.formControl}>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          history.push('/login');
                        }}
                      >
                        Login
                      </Link>
                    </div>
                  </form>
                )}
              </Formik>
            </>
          )}
          {isChanged && (
            <>
              <div className={classes.formControl}>
                <Collapse in>
                  <Alert severity="success">
                    <strong>Password has been changed !</strong>
                  </Alert>
                </Collapse>
              </div>
              <div className={classes.formControl}>
                <Button type="button" size="large" variant="contained" fullWidth color="primary" onClick={() => { history.push('/login'); }}>
                  Reconnect
                </Button>
              </div>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string,
    }),
  }).isRequired,
};

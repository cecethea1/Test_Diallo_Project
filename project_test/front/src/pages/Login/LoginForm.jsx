/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, TextField, InputAdornment, Divider, Container, makeStyles, Grid, Link,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 20,
    [theme.breakpoints.down('xs')]: {
      margin: 10,
    },
  },
}));

const LoginForm = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    values: { email, password },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
  } = props;
  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };
  return (
    <Container>
      <form onSubmit={handleSubmit} autoComplete="nope" noValidate>
        <div className={classes.formControl}>
          <TextField
            id="email"
            name="email"
            label="Email"
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
            fullWidth
            value={email}
            onChange={(e) => change('email', e)}
            InputProps={{
              autoComplete: 'nope',
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            helperText={touched.password ? errors.password : ''}
            error={touched.password && Boolean(errors.password)}
            fullWidth
            type="password"
            value={password}
            onChange={(e) => change('password', e)}
            InputProps={{
              autoComplete: 'new-password',
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Divider variant="fullWidth" />
        <div className={classes.formControl}>
          <Button type="submit" size="large" variant="contained" fullWidth color="primary" disabled={!isValid}>
            Login
          </Button>
        </div>
        <div className={classes.formControl}>
          <Grid item>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                history.push('/forgot');
              }}
            >
              Forgot Password?
            </Link>
          </Grid>
        </div>
      </form>
    </Container>
  );
};

export default LoginForm;

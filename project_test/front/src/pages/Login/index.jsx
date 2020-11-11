import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
  Collapse,
  Grid, makeStyles, Paper,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Formik } from 'formik';
import * as Yup from 'yup';
import LoginForm from './LoginForm';
import { LogInAsync } from '../../store/auth/reducer';
import { SET_ERROR } from '../../store/auth/actions';

const validationSchema = Yup.object({
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string('')
    .min(4, 'Password must contain at least 8 characters')
    .required('Enter your password'),
});

const useStyles = makeStyles((theme) => ({
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

export default function Login() {
  const { isLogged, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const submitLogin = async (data) => {
    const { email, password } = data;
    dispatch(LogInAsync({ email, password }));
  };
  const onCloseAlert = () => {
    dispatch({ type: SET_ERROR, payload: null });
  };


  // Redirect if user is connected
  if (isLogged) {
    history.push('/');
  }
  return (
    <Grid container>
      <Grid item lg={6} xs={false}>
        <div className={classes.image} />
      </Grid>
      <Grid item lg={6} xs={12} className={classes.container}>
        <Paper elevation={1} className={classes.paper}>
          <Collapse in={!!error}>
            <Alert onClose={onCloseAlert} severity="error">
              <strong>User</strong>
              {' '}
              unknown or incorrect
              {' '}
              <strong>password</strong>
            </Alert>
          </Collapse>
          <div>
            <h1>THMInsight</h1>
            <p> Welcome back ! Please login to your account</p>
          </div>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={submitLogin}
          >
            {(props) => <LoginForm {...props} />}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
}

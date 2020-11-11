/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
  Button, CircularProgress, Collapse, Grid, InputAdornment, Link, makeStyles, Paper, TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Email as EmailIcon } from '@material-ui/icons';
import { useHistory } from 'react-router';
import api from '../../store/api';

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    marginLeft: 0,
    marginRight: theme.spacing(1),
  },
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

function ReqestPage() {
  const classes = useStyles();
  const history = useHistory();
  const [forgetMail, setForgetMail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [isError, setIsError] = useState();

  const sendPassword = async () => {
    const clientUrl = window.location.href.split('forgot')[0];
    try {
      setLoading(true);
      const res = await api.post('/users/resetpassword', { forgetMail, clientUrl });
      if (res.status !== 200) {
        setIsError('server error');
      }
      setLoading(false);
      setMailSent(true);
    } catch (error) {
      setIsError(error);
      setLoading(false);
      setMailSent(false);
    }
  };

  return (
    <Grid container>
      <Grid item lg={6} xs={false}>
        <div className={classes.image} />
      </Grid>
      <Grid item lg={6} xs={12} className={classes.container}>
        <Paper elevation={1} className={classes.paper}>
          <Collapse in={!!isError}>
            <Alert onClose={() => setIsError(false)} severity="error">
              <strong>Error</strong>
            </Alert>
          </Collapse>
          <Collapse in={mailSent}>
            <Alert severity="success">
              <strong>Check your inbox for a password reset email. </strong>
            </Alert>
          </Collapse>
          <h1>THM Insight</h1>
          <p> Enter your e-mail and we will send you password reset link</p>
          <form>
            <div className={classes.formControl}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="email"
                error={isError}
                fullWidth
                value={forgetMail}
                onChange={(e) => setForgetMail(e.target.value)}
                InputProps={{
                  autoComplete: 'nope',
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className={classes.formControl}>
              <Button type="button" size="large" variant="contained" fullWidth color="primary" onClick={sendPassword}>
                {loading && <CircularProgress className={classes.circularProgress} size={20} />}
                Send Email
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
                Back to Login
              </Link>
            </div>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ReqestPage;

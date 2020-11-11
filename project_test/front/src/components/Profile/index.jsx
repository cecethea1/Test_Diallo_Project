/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Formik, ErrorMessage,
} from 'formik';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import * as Yup from 'yup';
import { useHistory } from 'react-router';
import {
  Button, Divider, FormControl, Grid, InputAdornment, makeStyles, Paper, TextField,
} from '@material-ui/core';
import {
  Person as PersonIcon, Work as WorkIcon, Edit as EditIcon,
} from '@material-ui/icons';
import MuiPhoneNumber from 'material-ui-phone-number';
import api from '../../store/api';
import './style.scss';


const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(70, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(70, 'Too Long!')
    .required('Required'),
  country: Yup.string()
    .required('Required'),
  city: Yup.string()
    .required('Required'),
  position: Yup.string()
    .required('Required'),
  phoneNumber: Yup.string()
    .required('Required')
    .min(17, 'Too Short!'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  formGroup: {
    padding: '50px 50px',
    marginTop: 10,
    width: 'inherit',
  },
  footer: {
    display: 'flex',
    alignItems: 'flex-end',
    width: 'inherit',
  },
  selectGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 20,
    bottom: 0,
    width: 'inherit',
  },
  select: {
    border: 'none',
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    backgroundColor: 'white',
    outline: 'none',
    margin: 10,
  },
  formControl: {
    margin: 10,
    width: '100%',
  },
  toggleEdit: {
    display: 'flex',
    alignItems: 'flex-end',
    width: 'inherit',
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

const ProfileForm = (props) => {
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const classes = useStyles();
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
  } = props;

  const change = (e, name) => {
    if (e.persist) {
      e.persist();
      handleChange(e);
      props.setProfile((prevProfile) => ({ ...prevProfile, [name]: e.target.value }));
      setFieldTouched(name, true, false);
    } else {
      handleChange({ target: { name, value: e } });
      props.setProfile((prevProfile) => ({ ...prevProfile, [name]: e }));
      setFieldTouched(name, true, false);
    }
  };
  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.root} lg={12}>
        <Paper className={classes.paper}>
          <h1>Profile</h1>
          <FormControl className={classes.toggleEdit}>
            <Button
              active={toggleUpdate.toString()}
              variant="contained"
              color="primary"
              startIcon={(<EditIcon />)}
              onClick={() => setToggleUpdate((t) => !t)}
            >
              {!toggleUpdate ? 'Edit' : 'Editing ...'}
            </Button>
          </FormControl>
          <form autoComplete="nope" className={classes.formGroup} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item lg={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="firstName"
                    name="firstName"
                    label="First name"
                    fullWidth
                    disabled={!toggleUpdate}
                    value={values.firstName || ''}
                    helperText={touched.firstName ? errors.firstName : ''}
                    error={touched.firstName && Boolean(errors.firstName)}
                    onChange={(e) => change(e, 'firstName')}
                    InputProps={{
                      autoComplete: 'nope',
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    fullWidth
                    disabled={!toggleUpdate}
                    value={values.lastName || ''}
                    helperText={touched.lastName ? errors.lastName : ''}
                    error={touched.lastName && Boolean(errors.lastName)}
                    onChange={(e) => change(e, 'lastName')}
                    InputProps={{
                      autoComplete: 'nope',
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="position"
                    name="position"
                    label="position"
                    fullWidth
                    disabled={!toggleUpdate}
                    value={values.position || ''}
                    helperText={touched.position ? errors.position : ''}
                    error={touched.position && Boolean(errors.position)}
                    onChange={(e) => change(e, 'position')}
                    InputProps={{
                      autoComplete: 'nope',
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={6} className={classes.selectGroup}>
                <FormControl className={classes.formControl}>
                  <CountryDropdown
                    className={classes.select}
                    disabled={!toggleUpdate}
                    name="country"
                    value={values.country || ''}
                    onChange={(v) => change(v, 'country')}
                  />
                  <ErrorMessage name="country" component="div" />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <RegionDropdown
                    country={values.country}
                    name="city"
                    value={values.city || ''}
                    disabled={!toggleUpdate}
                    className={classes.select}
                    onChange={(v) => change(v, 'city')}
                  />
                  <ErrorMessage name="city" component="div" />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <MuiPhoneNumber
                    defaultCountry="fr"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={values.phoneNumber || ''}
                    onChange={(v) => change(v, 'phoneNumber')}
                    disabled={!toggleUpdate}
                  />
                  <ErrorMessage name="phoneNumber" component="div" />
                </FormControl>
              </Grid>
              <Divider variant="fullWidth" />
              <FormControl className={classes.footer}>
                <Button type="submit" size="large" variant="contained" color="primary" disabled={(!toggleUpdate || !isValid)}>
                  Update
                </Button>
              </FormControl>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};
const Profile = () => {
  const history = useHistory();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.status === 200) {
          setProfile({ ...res.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
  }, []);

  const updateProfile = async (values) => {
    try {
      const res = await api.put('/users', { ...values });
      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        history.go(0);
      } else {
        throw (new Error('Data error'));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      { profile && (
        <Formik
          initialValues={profile}
          validationSchema={ProfileSchema}
          onSubmit={updateProfile}
        >
          {(props) => <ProfileForm {...props} setProfile={setProfile} />}
        </Formik>
      )}
    </>
  );
};
export default Profile;

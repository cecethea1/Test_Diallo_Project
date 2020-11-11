import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Switch } from '@material-ui/core';
import InputField from '../../FormFields/InputField';
import FormField from '../../FormModel/sensorFormModel';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const {
    formField: {
      serialNumberSensor, nameSensor, typeSensor, FO,
    },
  } = FormField;
  console.log(JSON.stringify(FormField));

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={5}>
            <Grid item xs={12} sm={6} style={{ backgroundColor: 'white', marginTop: '20px' }}>
              <Grid container direction="column" spacing={10} style={{ padding: '20px' }}>
                <Grid item xs={12} sm={12}>
                  <InputField
                    name={typeSensor.name}
                    label={typeSensor.label}
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField
                    name={nameSensor.name}
                    label={nameSensor.label}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField
                    name={serialNumberSensor.name}
                    label={serialNumberSensor.label}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} style={{ backgroundColor: 'white', marginTop: '20px' }}>
              <Grid container direction="column" spacing={10} style={{ padding: '20px' }}>
                <Grid item xs={12} sm={12}>
                  <InputField
                    name={typeSensor.name}
                    label={typeSensor.label}
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Switch
                    checked={state.checkedB}
                    onChange={handleChangeSwitch}
                    name="checkedB"
                    color="primary"
                    label="Yes"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField
                    name={FO.name}
                    label={FO.label}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

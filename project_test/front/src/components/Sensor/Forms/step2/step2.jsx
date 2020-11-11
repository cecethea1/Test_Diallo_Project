import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import FormSubTep from '../formSensors/sensorForm';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.objectOf(PropTypes.any).isRequired,
  index: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    backgroundColor: 'transparent',
  },
}));

export default function Step2() {
  const { values: formValues } = useSelector((state) => state.sensor);
  console.log({ formValues });
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(formValues.checked[0] ? formValues.checked[0].type : undefined);
  const [selectedSubTab, setSelectedSubTab] = useState(`${formValues.checked[0].type} #1`);

  const handleSelectedTab = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedSubTab(`${newValue} #1`);
  };
  const handleSelectedSubTab = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">
          {}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs key={selectedTab} value={selectedTab} onChange={handleSelectedTab} aria-label="Sensor Types Tabs">
              {
                formValues.checked.length > 0 && formValues.checked.map((sensor, index) => (
                  <Tab key={sensor.type} value={sensor.type} className={classes.tabs} label={`${sensor.type}`} {...a11yProps(index.toString())} />))
              }
            </Tabs>
          </AppBar>
          <Paper square>
            <Tabs
              indicatorColor="secondary"
              textColor="secondary"
              value={selectedSubTab}
              onChange={handleSelectedSubTab}
              aria-label="Sensor SubTabs"
            >
              {
                Array.from(Array(formValues.checked.find((s) => (s.type === selectedTab)) ? Number(formValues.checked.find((s) => (s.type === selectedTab)).count) : 0).keys()).map((k) => (
                  <Tab
                    key={`${selectedTab} #${k + 1}`}
                    className={classes.tabs}
                    value={`${selectedTab} #${k + 1}`}
                    label={`${selectedTab} #${k + 1}`}
                    {...a11yProps(k.toString())}
                  />
                ))
              }
            </Tabs>
          </Paper>
          <TabPanel key={selectedSubTab} value={Number(selectedSubTab.split('#')[1])} index={Number(selectedSubTab.split('#')[1])}>
            <h1>
              <FormSubTep />
            </h1>
          </TabPanel>
          <pre>
            {' '}
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>
      </Grid>
    </Grid>
  );
}

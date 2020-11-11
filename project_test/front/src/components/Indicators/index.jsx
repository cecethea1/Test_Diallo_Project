import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import CardIndicator from './CardIndicator';
import { fetchAlertsCountAsync } from '../../store/alert/reducer';


function Indicators({ project }) {
  const { alertsCount } = useSelector((state) => state.alert);
  const [sensorsCount, setSensorsCount] = useState('--');
  const dispatch = useDispatch();
  useEffect(() => {
    if (project) {
      setSensorsCount(parseInt(project.sensorscount, 10));
      dispatch(fetchAlertsCountAsync(project.id));
    }
  }, [project, dispatch]);
  return (
    <Grid container spacing={1}>
      <Grid item lg={4} xs={12}>
        <CardIndicator title="Total Sensors" value={sensorsCount} />
      </Grid>
      <Grid item lg={4} xs={12}>
        <CardIndicator title="Alert Sent" value={alertsCount} />
      </Grid>
      <Grid item lg={4} xs={12}>
        <CardIndicator title="Operating Rate" value="100%" />
      </Grid>
    </Grid>
  );
}

Indicators.propTypes = {
  project: PropTypes.objectOf(PropTypes.any),
};
Indicators.defaultProps = {
  project: null,
};

export default Indicators;

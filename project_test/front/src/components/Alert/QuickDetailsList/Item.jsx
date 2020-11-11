import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, makeStyles } from '@material-ui/core';
import moment from 'moment';
import api from '../../../store/api';
import AlertIcon from '../../Shared/AlertIcon';


const useStyles = makeStyles((theme) => ({
  alertRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  alertText: {
    letterSpacing: '0px',
    color: theme.palette.grey[400],
  },
  alertCount: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    opacity: 1,
    fontSize: '1em',
  },
}));

function Item({ alertType, text, project }) {
  const classes = useStyles();
  const [alertData, setAlertData] = useState('--');
  const [loading, setLoading] = useState(true);
  const parseDate = ({ data }) => (data ? moment(new Date(data.created_at)).format('D/M/Y HH:mm:ss') : '--:--');

  useEffect(() => {
    let cancel = false;
    const getAlertCount = async () => {
      setLoading(true);
      if (project) {
        const lastMeasured = api.get('/alerts/logs/last');
        const alertCount = api.get(`/projects/${project.id}/alerts/count?type=${alertType}`);
        const response = alertType === 'Updated' ? await lastMeasured : await alertCount;
        try {
          if (response.status === 200) {
            const data = alertType === 'Updated' ? parseDate(response) : response.data.count;
            if (cancel) { return; }
            setAlertData(data);
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      }
    };

    getAlertCount();
    return () => { cancel = true; };
  }, [project, alertType]);

  return (
    <div className={classes.alertRow}>
      <AlertIcon type={alertType} />
      <span className={classes.alertText}>
        {text}
      </span>
      <span className={classes.alertCount}>
        {loading && project && (
          <CircularProgress color="secondary" />
        )}
        {!loading && project && alertData}
        {!project && '--'}
      </span>
    </div>
  );
}

Item.propTypes = {
  alertType: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  project: PropTypes.objectOf(PropTypes.any),
};
Item.defaultProps = {
  project: null,
};

export default Item;

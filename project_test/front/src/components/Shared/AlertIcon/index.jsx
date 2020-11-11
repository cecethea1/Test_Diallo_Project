import React from 'react';
import { Avatar, makeStyles } from '@material-ui/core';
import {
  ErrorOutline as ErrorOutlineIcon,
  Cached as CashedIcon,
  AccessAlarm as AccessAlarmIcon,
  HighlightOff as HighlightOffIcon,
} from '@material-ui/icons';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  alertIcon: {
    marginRight: '10px',
  },
  warning: {
    background: '#f0f0f7',
    color: '#b4b4c6',
    fontSize: '3vh',
  },
  updated: {
    background: '#daf7e8',
    color: '#4ad991',
    fontSize: '3vh',
  },
  alertColor: {
    background: '#fff4e5',
    color: '#ffca83',
    fontSize: '3vh',
  },
  contractual: {
    background: '#ffe2e6',
    color: '#ff7285',
    fontSize: '3vh',
  },
}));
const AlertIcon = ({ type, ...rest }) => {
  const classes = useStyles();
  switch (type) {
    case 'Warning':
      return <Avatar overlap="circle" {...rest} className={`${classes.alertIcon} ${classes.warning}`}><ErrorOutlineIcon /></Avatar>;
    case 'Updated':
      return <Avatar overlap="circle" {...rest} className={`${classes.alertIcon} ${classes.updated}`}><CashedIcon /></Avatar>;
    case 'Alert':
      return <Avatar overlap="circle" {...rest} className={`${classes.alertIcon} ${classes.alertColor}`}><AccessAlarmIcon /></Avatar>;
    default:
      return <Avatar overlap="circle" {...rest} className={`${classes.alertIcon} ${classes.contractual}`}><HighlightOffIcon /></Avatar>;
  }
};

AlertIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default AlertIcon;

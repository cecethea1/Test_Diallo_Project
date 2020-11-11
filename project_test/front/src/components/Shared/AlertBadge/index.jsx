import React from 'react';
import PropTypes from 'prop-types';
import {
  Chip, List, ListItem, ListItemIcon, ListItemText, Popover,
} from '@material-ui/core';
import AlertIcon from '../AlertIcon';

const CustomBadge = (props) => {
  const { alert, ...rest } = props;
  const {
    project_name: projectName, site_name: siteName, sensor_name: sensorName, payload: {
      value, limit, threshold, metric, unit,
    },
  } = alert;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Chip
        size="medium"
        label={alert.type}
        onClick={handleClick}
        clickable
        {...rest}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List dense>
          <ListItem>
            <ListItemIcon>Type</ListItemIcon>
            <ListItemText primary={alert.type} />
          </ListItem>
          <ListItem>
            <ListItemIcon>Project</ListItemIcon>
            <ListItemText primary={projectName} />
          </ListItem>
          <ListItem>
            <ListItemIcon>Site</ListItemIcon>
            <ListItemText primary={siteName} />
          </ListItem>
          <ListItem>
            <ListItemIcon>Sensor</ListItemIcon>
            <ListItemText primary={sensorName} />
          </ListItem>
          <ListItem>
            <ListItemIcon>Actual</ListItemIcon>
            <ListItemText primary={value} />
          </ListItem>
          <ListItem>
            <ListItemIcon>Limit</ListItemIcon>
            <ListItemText primary={limit} />
          </ListItem>
          <ListItem>
            <ListItemIcon>Threshold</ListItemIcon>
            <ListItemText primary={threshold} style={{ marginLeft: 16 }} />
          </ListItem>
          <ListItem>
            <ListItemIcon> Metric </ListItemIcon>
            <ListItemText primary={metric} />
          </ListItem>
          <ListItem>
            <ListItemIcon> Unit </ListItemIcon>
            <ListItemText primary={unit} />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

const AlertBadge = ({ alert }) => {
  switch (alert.type) {
    case 'Alert':
      return <CustomBadge avatar={<AlertIcon type={alert.type} />} alert={alert} />;
    case 'Warning':
      return <CustomBadge avatar={<AlertIcon type={alert.type} />} alert={alert} />;
    default:
      return <CustomBadge avatar={<AlertIcon type={alert.type} />} alert={alert} />;
  }
};

AlertBadge.propTypes = {
  alert: PropTypes.objectOf(PropTypes.any).isRequired,
};
CustomBadge.propTypes = {
  alert: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AlertBadge;

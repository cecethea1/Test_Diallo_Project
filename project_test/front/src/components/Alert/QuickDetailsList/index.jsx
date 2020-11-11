import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, CardHeader, List, ListItem, makeStyles,
} from '@material-ui/core';
import Item from './Item';

const alerts = [
  { text: 'Up to date', type: 'Updated' },
  { text: 'Warning Values', type: 'Warning' },
  { text: 'Alert Alarm', type: 'Alert' },
  { text: 'Contractual Alarm', type: 'Contractual' },
];

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.main,
  },
  card: {
    height: (props) => (props.minHeight ? 'auto' : '100%'),
  },
  cardItem: {
    minHeight: '82px',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'stretch',
    font: 'Regular 13px/20px Source Sans Pro',
  },
}));

const QuickDetailsList = ({ project, ...props }) => {
  const classes = useStyles(props);
  return (
    <Card className={classes.card}>
      <CardHeader title={<b>Quick Details</b>} className={classes.title} />
      <CardContent>
        <List>
          {alerts.map((alert) => (
            <ListItem button className={classes.cardItem} key={alert.type}>
              <Item text={alert.text} alertType={alert.type} project={project} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

QuickDetailsList.propTypes = {
  project: PropTypes.objectOf(PropTypes.any),
};
QuickDetailsList.defaultProps = {
  project: null,
};
export default QuickDetailsList;

import React from 'react';
import {
  Avatar, fade, Grid, IconButton, List, ListItem, makeStyles, Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  large: {
    padding: '5px',
    position: 'absolute',
    backgroundColor: '#ff6565',
    margin: '-25px 0 0 -25px',
    right: '10%',
  },
  footer: {
    textAlign: 'center',
  },
  primaryBg: {

  },
  item: {
    backgroundColor: theme.palette.primary.main,
    border: `0.5px solid ${theme.palette.primary.light}`,
    color: fade(theme.palette.common.white, 0.5),
  },
}));

export default function Specifications(props) {
  const { title, values } = props;
  const classes = useStyles();

  return (
    <Paper elevation={3}>
      <List className={classes.root}>
        {values.map((value, i) => (
          <ListItem key={value.key} index={i} className={classes.item}>
            <Grid container>
              <Grid item xs={6} md={6}>
                {value.key}
              </Grid>
              <Grid item xs={6} md={6}>
                {value.value}
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem className={classes.footer}>
          <Grid container spacing={2}>
            <Grid item xs={8} md={8}>
              <h4>{title}</h4>
            </Grid>
            <Grid item xs={4} md={4}>
              <Avatar className={classes.large} variant="circle">
                <IconButton src="src=/images/icons/icon_specification.svg" />
              </Avatar>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Paper>
  );
}

Specifications.propTypes = {
  title: PropTypes.string,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

Specifications.defaultProps = {
  values: [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
    { key: 'key3', value: 'value3' },
    { key: 'key4', value: 'value4' },
    { key: 'key5', value: 'value5' },
  ],
  title: '--',
};

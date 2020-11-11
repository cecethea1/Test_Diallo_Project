import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, CardHeader, CardMedia, Grid, makeStyles,
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    color: theme.palette.primary.main,
  },
  value: {
    marginLeft: '20px',
    width: '100%',
    color: theme.palette.primary.main,
  },
  media: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cover: {
    width: 50,
    height: 50,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
    },
    right: 0,
  },
}));

const CardIndicator = (props) => {
  const classes = useStyles();
  const { title, value } = props;
  return (
    <Card>
      <CardHeader title={<b>{title}</b>} className={classes.title} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item sm={8} xs={4}><b className={classes.value}>{value}</b></Grid>
          <Grid item sm={4} className={classes.media}>
            <CardMedia
              className={classes.cover}
              image="/images/graphics.svg"
              src="/images/graphics.svg"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


CardIndicator.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CardIndicator;

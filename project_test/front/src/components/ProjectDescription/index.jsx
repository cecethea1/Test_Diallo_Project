import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, CardHeader, Divider, Grid, List, ListItem, makeStyles,
} from '@material-ui/core';
import ResponsiveCarousel from '../ResponsiveCarousel';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  mainList: {
    fontSize: '0.8em',
  },
  listItemTitle: {
    color: theme.palette.grey[400],
  },
  listItemValue: {
    color: theme.palette.grey[700],
  },
  description: {
    fontSize: '0.8em',
  },
  title: {
    color: theme.palette.primary.main,
  },
}));

export default function ProjectDescription({ project }) {
  const {
    name, companies, description,
  } = project;
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader title={<b>Project Description</b>} className={classes.title} />
      <CardContent>
        <Grid container>
          <Grid item lg={6} xs={12}>
            <Grid item lg={12}>
              <List variant="flush" className={classes.mainList}>

                <ListItem>
                  <p className={classes.listItemTitle}>Name</p>
                  <Divider variant="middle" orientation="vertical" />
                  <p className={classes.listItemValue}>{name}</p>
                </ListItem>
                <ListItem>
                  <p className={classes.listItemTitle}>Client</p>
                  <Divider variant="middle" orientation="vertical" />
                  <p className={classes.listItemValue}>{companies.find((e) => e.role === 'client').name.toString()}</p>
                </ListItem>
                <ListItem>
                  <p className={classes.listItemTitle}>Location</p>
                  <Divider variant="middle" orientation="vertical" />
                  <p className={classes.listItemValue}>{companies.find((e) => e.role === 'client').address.toString()}</p>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Grid item lg={6} xs={12}>
            <ResponsiveCarousel project={project} />
          </Grid>
          <Grid item xs={12}>
            <List className={classes.description}>
              <ListItem>
                <p className={classes.listItemValue}>{description}</p>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

ProjectDescription.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    })),
    companies: PropTypes.arrayOf(PropTypes.shape({
      role: PropTypes.string,
      name: PropTypes.string,
    })),
  }),
};

ProjectDescription.defaultProps = {
  project: {
    name: 'not specified',
    location: 'not specified',
    photos: [{ url: '/images/cementys.jpg', name: 'Cementys' }],
    companies: [{ role: 'client', name: 'not specified', address: 'not specified' }],
    description: 'not specified',
  },
};

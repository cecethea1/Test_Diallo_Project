import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ProjectDescription from '../ProjectDescription';
import { fetchProjectByIdAsync } from '../../store/project/reducer';
import { subscribeUser } from '../../subscription';

const useStyles = makeStyles(() => ({
  paper: {
    cursor: 'pointer',
  },
}));
function ProjectsDialog({ projects }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const selectProject = (id) => {
    subscribeUser();
    dispatch(fetchProjectByIdAsync(id));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      aria-labelledby="projects dialog"
    >
      <DialogTitle>
        Choose your project
      </DialogTitle>
      <DialogContent>
        <Grid spacing={2} container>
          {projects && projects.length > 0 ? projects.map((project) => (
            <Grid item lg={5} xs={12} key={project.id}>
              <Paper className={classes.paper} onClick={() => selectProject(project.id)}>
                <ProjectDescription project={project} />
              </Paper>
            </Grid>
          )) : (
            <Grid item>
              <h4>No project found</h4>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={() => dispatch({ type: 'LOGOUT' })}>Disconnect</Button>
      </DialogActions>
    </Dialog>
  );
}

ProjectsDialog.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.any).isRequired,
};
export default ProjectsDialog;

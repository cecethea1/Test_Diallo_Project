import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
  Fab,
  FormControl, FormGroup, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import clsx from 'clsx';
import DeleteForever from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import CropFree from '@material-ui/icons/CropFree';
import DragIndicator from '@material-ui/icons/DragIndicator';
import { green } from '@material-ui/core/colors';
import { Alert, AlertTitle } from '@material-ui/lab';
import PageContainer from '../Shared/PageContainer';
import Layout from './Layout';
import SideBar from './SideBar';
import './style.scss';
import { SET_ERROR } from '../../store/dashboard/actions';
import { createDashboardAsync, deleteDashboardAsync, updateDashboardAsync } from '../../store/dashboard/reducer';
import AlertDialog from '../Shared/ALertDialog';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: '20px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: 0,
    paddingTop: theme.spacing(1),
  },
  container: {
    minHeight: '100vh',
    marginTop: 10,
  },
  buttonsGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    margin: theme.spacing(1),
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '20%',
    left: '60%',
  },
}));

const deletMessage = (dashboardName) => (
  <Alert severity="warning">
    <AlertTitle>Warning</AlertTitle>
    You are sure that you really want to delete this dashboard
    {' '}
    {dashboardName}
  </Alert>
);
function AddDashboard() {
  const {
    addLayouts, currentBreakpoint, dashboard,
  } = useSelector((state) => state.dashboard);
  const { projects, currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedProject, setSelectedProject] = useState((currentProject) || undefined);
  const [name, setName] = useState(dashboard ? dashboard.name : '');
  const [isDraggable, setIsDraggable] = useState(false);
  const [isResizable, setIsResizable] = useState(true);
  const [showDialogAlert, setShowDialogAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();

  const classes = useStyles();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const toggleResizeHandler = () => {
    setIsResizable((resizable) => !resizable);
  };
  const toggleDragHandler = () => {
    setIsDraggable((draggable) => !draggable);
  };

  useEffect(() => () => {
    clearTimeout(timer.current);
  }, []);

  useEffect(() => () => {
    setSelectedProject(currentProject);
  }, [currentProject]);

  const deleteDashboardHandler = () => {
    dispatch(deleteDashboardAsync(dashboard.id));
    history.push('/');
  };

  const submitDashboardHandler = async () => {
    if (selectedProject && name !== '' && addLayouts[currentBreakpoint].length > 0) {
      try {
        if (!loading) {
          setSuccess(false);
          setLoading(true);
          timer.current = setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            setName('');
          }, 2000);
        }
        if (!dashboard) {
          dispatch(createDashboardAsync(selectedProject.id, name, addLayouts));
        } else {
          dispatch(updateDashboardAsync(dashboard.id, selectedProject.id, name, addLayouts));
          setTimeout(() => {
            history.push('/');
          }, 2000);
        }
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error });
      }
    }
  };
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item lg={2} xs={12}>
          <SideBar />
        </Grid>
        <Grid item lg={10}>
          <Paper className={classes.paper} elevation={3}>
            <h1>Create Dashboard</h1>
            <FormGroup className={classes.formGroup} row>
              <FormGroup row>
                <FormControl className={classes.formControl}>
                  {dashboard && selectedProject && (
                    <TextField id="project" value={selectedProject.name} disabled label="Project" />
                  )}
                  {!dashboard && (
                    <InputLabel className={classes.selectIcon} id="project-select-label">
                      Select Project
                    </InputLabel>
                  )}
                  {!dashboard && (
                    <Select
                      labelId="project-select-label"
                      id="project-select"
                      value={selectedProject.name}
                    >
                      {projects && projects.length > 0 && projects.map((project) => (
                        <MenuItem selected={project.id === currentProject.id} onClick={() => setSelectedProject(project)} value={project.name} key={project.id}>
                          <span>{project.name}</span>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField id="dashboard-title" value={name} onChange={(e) => setName(e.target.value)} label="Dashboard Title" />
                </FormControl>
              </FormGroup>
              <FormGroup row>
                <FormControl className={`${classes.formControl} ${classes.buttonsGroup}`}>
                  {dashboard && !success && (
                    <div className={classes.wrapper}>
                      <Fab
                        aria-label="Delete"
                        color="primary"
                        className={buttonClassname}
                        onClick={() => setShowDialogAlert(true)}
                      >
                        <DeleteForever />
                      </Fab>
                    </div>
                  )}
                  <div className={classes.wrapper}>
                    <Fab
                      aria-label="toggleDrag"
                      color={!isDraggable ? 'primary' : 'secondary'}
                      onClick={toggleDragHandler}
                    >
                      <DragIndicator />
                    </Fab>
                  </div>
                  <div className={classes.wrapper}>
                    <Fab
                      aria-label="toggleResize"
                      color={!isResizable ? 'primary' : 'secondary'}
                      onClick={toggleResizeHandler}
                    >
                      <CropFree />
                    </Fab>
                  </div>
                  <div className={classes.wrapper}>
                    <Fab
                      aria-label="save"
                      color="primary"
                      className={buttonClassname}
                      onClick={submitDashboardHandler}
                    >
                      {success ? <CheckIcon /> : <SaveIcon />}
                    </Fab>
                    {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                  </div>
                </FormControl>
              </FormGroup>
            </FormGroup>
          </Paper>
          <Paper className={classes.container} elevation={2}>
            <Layout project={selectedProject} isDraggable={isDraggable} isResizable={isResizable} />
            {showDialogAlert && (
              <AlertDialog
                title={`Delete Dashboard ${dashboard.name}`}
                dialogContent={deletMessage(dashboard.name)}
                noCullback={() => setShowDialogAlert(false)}
                okCullback={deleteDashboardHandler}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default AddDashboard;

import React, { useState, useRef } from 'react';
import {
  Container, FormControl, Input, InputLabel, List, ListItem, makeStyles, Paper,
} from '@material-ui/core';
import {
  Add as AddIcon, Search as SearchIcon, Edit as EditIcon,
} from '@material-ui/icons';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import ColorArray from '../../../utils/ColorArray';
import { SET_CURRENT_DASHBOARD, UPDATE_ADD_LAYOUTS, UPDATE_LAYOUTS } from '../../../store/dashboard/actions';

const useStyles = makeStyles((theme) => ({
  addBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  listItem: {
    borderLeft: `10px solid ${theme.palette.secondary.light}`,
    minHeight: '80px',
    overflowWrap: 'anywhere',
    outline: 'none',
    fontSize: '0.7em',
    padding: '10px',
  },
}));
function DashboardSideBar({
  dashboards, dashboard,
}) {
  const { currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const inputRef = useRef();
  const classes = useStyles();

  const updateDashboard = () => {
    if (dashboard && dashboard.id) {
      dispatch({ type: UPDATE_ADD_LAYOUTS, payload: dashboard.payload });
      history.push('/dashboard/create');
    }
  };
  const createNewDashboard = () => {
    dispatch({ type: SET_CURRENT_DASHBOARD, payload: null });
    dispatch({ type: UPDATE_ADD_LAYOUTS, payload: { lg: [], xxs: [] } });
    history.push('/dashboard/create');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const searchHandler = (e) => {
    const { value } = e.target;
    setSearchQuery(value.toLowerCase());
  };
  const dashboardFilter = (item) => {
    if (searchQuery !== '') {
      return (item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
    }
    return item;
  };

  const selectDashboard = (d) => {
    setSearchQuery('');
    inputRef.current.value = '';
    dispatch({ type: SET_CURRENT_DASHBOARD, payload: d });
    dispatch({ type: UPDATE_LAYOUTS, payload: d.payload });
  };

  return (
    <Paper elevation={3} className={classes.paper}>
      <Container>
        <List component="nav" aria-label="main dashboards">
          <ListItem>
            <FormControl>
              <InputLabel htmlFor="search-sidebar">Dashboards</InputLabel>
              <Input
                id="search-sidebar"
                type="text"
                onChange={searchHandler}
                ref={inputRef}
                endAdornment={<SearchIcon />}
              />
            </FormControl>
          </ListItem>
          {currentProject && dashboards && dashboards.length > 0
            && dashboards.filter(dashboardFilter).map((d, i) => (
              <ListItem
                button
                selected={dashboard && dashboard.id === d.id}
                style={{
                  borderLeft: `10px solid ${ColorArray.getarray(100)[i]}`,
                  minHeight: '80px',
                  backgroundColor: (dashboard && dashboard.id === d.id) ? '#9b9b9b' : null,
                  outline: 'none',
                }}
                key={d.id}
                onClick={() => selectDashboard(d)}
              >
                {d.name}
              </ListItem>
            ))}
          <ListItem className={classes.addBtn}>
            <SpeedDial
              ariaLabel="Dashboard Edit"
              icon={<SpeedDialIcon />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
            >
              {dashboards && dashboards.length > 0 && (
                <SpeedDialAction
                  key="Edit"
                  icon={<EditIcon />}
                  tooltipTitle="Edit"
                  onClick={updateDashboard}
                />
              )}
              <SpeedDialAction
                key="Create"
                icon={<AddIcon />}
                tooltipTitle="Create"
                onClick={createNewDashboard}
              />
            </SpeedDial>
          </ListItem>
        </List>
      </Container>
    </Paper>
  );
}

DashboardSideBar.propTypes = {
  dashboards: PropTypes.arrayOf(PropTypes.any),
  dashboard: PropTypes.objectOf(PropTypes.any),
};

DashboardSideBar.defaultProps = {
  dashboards: null,
  dashboard: null,
};

export default DashboardSideBar;

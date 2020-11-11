import React, { useState, useRef } from 'react';
import {
  Container, FormControl, Input, InputLabel, List, ListItem, makeStyles, Paper,
} from '@material-ui/core';
import {
  Add as AddIcon, Search as SearchIcon,
} from '@material-ui/icons';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import ColorArray from '../../../utils/ColorArray';
import { SET_CURRENT_CONFIG } from '../../../store/graph/actions';


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

function GraphSideBar({ config, configs }) {
  const { currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const inputRef = useRef();
  const classes = useStyles();


  const createNewGraph = () => {
    dispatch({ type: SET_CURRENT_CONFIG, payload: null });
    history.push('/graphs/editor');
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
  const configFilter = (item) => {
    if (searchQuery !== '') {
      return (item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
    }
    return item;
  };

  const selectGraph = (d) => {
    setSearchQuery('');
    inputRef.current.value = '';
    dispatch({ type: SET_CURRENT_CONFIG, payload: d });
  };

  return (
    <Paper elevation={3} className={classes.paper}>
      <Container>
        <List component="nav" aria-label="main graphs">
          <ListItem>
            <FormControl>
              <InputLabel htmlFor="search-sidebar">Graphs</InputLabel>
              <Input
                id="search-sidebar"
                type="text"
                onChange={searchHandler}
                ref={inputRef}
                endAdornment={<SearchIcon />}
              />
            </FormControl>
          </ListItem>
          {currentProject && configs && configs.length > 0
            && (
            <ListItem
              button
              selected={config === null}
              style={{
                borderLeft: `10px solid ${ColorArray.getarray(100)[0]}`,
                minHeight: '80px',
                backgroundColor: (config && config.id === null) ? '#9b9b9b' : null,
                outline: 'none',
              }}
              key="default"
              onClick={() => selectGraph()}
            >
              All graph
            </ListItem>
            )}
          {currentProject && configs && configs.length > 0
            && configs.filter(configFilter).map((d, i) => (
              <ListItem
                button
                selected={config && config.id === d.id}
                style={{
                  borderLeft: `10px solid ${ColorArray.getarray(100)[i]}`,
                  minHeight: '80px',
                  backgroundColor: (config && config.id === d.id) ? '#9b9b9b' : null,
                  outline: 'none',
                }}
                key={d.id}
                onClick={() => selectGraph(d.id)}
              >
                {d.name}
              </ListItem>
            ))}
          <ListItem className={classes.addBtn}>
            <SpeedDial
              ariaLabel="Graph Edit"
              icon={<SpeedDialIcon />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
            >
              <SpeedDialAction
                key="Create"
                icon={<AddIcon />}
                tooltipTitle="Create"
                onClick={createNewGraph}
              />
            </SpeedDial>
          </ListItem>
        </List>
      </Container>
    </Paper>
  );
}

GraphSideBar.propTypes = {
  configs: PropTypes.arrayOf(PropTypes.any),
  config: PropTypes.number,
};

GraphSideBar.defaultProps = {
  configs: null,
  config: null,
};

export default GraphSideBar;

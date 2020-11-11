import React, { useState, useRef, useEffect } from 'react';
import {
  Container, FormControl, Input, InputLabel, List, ListItem, makeStyles, Paper,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Search as SearchIcon } from '@material-ui/icons';
import ColorArray from '../../../utils/ColorArray';
import { REMOVE_COMPONENT, SELECT_COMPONENT } from '../../../store/dashboard/actions';

const useStyles = makeStyles(() => ({
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
    minHeight: '80px',
    overflowWrap: 'anywhere',
    outline: 'none',
    fontSize: '0.7em',
    padding: '10px',
  },
}));

function AddDashboardSideBar() {
  const { addLayouts, currentBreakpoint, constants } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [componentsList, setComponentsList] = useState(constants[currentBreakpoint]);
  const inputRef = useRef();
  const classes = useStyles();


  useEffect(() => {
    setComponentsList(constants[currentBreakpoint]);
  }, [currentBreakpoint, constants]);

  const searchHandler = (e) => {
    const { value } = e.target;
    setSearchQuery(value.toLowerCase());
  };
  const componentsFilter = (item) => {
    if (searchQuery !== '') {
      return (item.i.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
    }
    return item;
  };

  const addComponentHandler = (c) => {
    setSearchQuery('');
    inputRef.current.value = '';
    const newComponent = componentsList.find((e) => e.i === c.i);
    dispatch({ type: SELECT_COMPONENT, payload: newComponent });
  };
  const removeComponentHandler = (c) => {
    dispatch({ type: REMOVE_COMPONENT, payload: c });
  };
  const matchedComponent = (c) => addLayouts[currentBreakpoint] && addLayouts[currentBreakpoint].filter((component) => (c.i === component.i)).length > 0;
  return (
    <Paper elevation={3} className={classes.paper}>
      <Container>
        <List component="nav" aria-label="main dashboards">
          <ListItem className="form-group has-search border-bottom-0">
            <FormControl>
              <InputLabel htmlFor="search-sidebar">Components</InputLabel>
              <Input
                id="search-sidebar"
                type="text"
                onChange={searchHandler}
                ref={inputRef}
                endAdornment={<SearchIcon />}
              />
            </FormControl>
          </ListItem>
          {componentsList
            && componentsList.filter(componentsFilter).map((c, i) => (
              <ListItem
                button
                className={classes.listItem}
                style={{
                  borderLeft: `10px solid ${ColorArray.getarray(100)[i]}`,
                  backgroundColor: matchedComponent(c) ? '#9b9b9b' : null,
                }}
                key={c.i}
                onClick={() => (matchedComponent(c) ? removeComponentHandler(c) : addComponentHandler(c))}
              >
                {c.i}
              </ListItem>
            ))}
        </List>
      </Container>
    </Paper>
  );
}

export default AddDashboardSideBar;

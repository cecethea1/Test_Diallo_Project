import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, FormControl, Grid, Input, InputLabel, List, ListItem, makeStyles,
} from '@material-ui/core';
import { Search as SearchIcon, Room as RoomIcon } from '@material-ui/icons';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../store/api';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '220px',
  },
  title: {
    color: theme.palette.primary.main,
  },
  content: {
    color: theme.palette.secondary,
  },
  paper: {
    width: '100%',
    padding: '10px',
  },
}));

function SearchList({
  project, limit, linkto, searchname,
}) {
  const classes = useStyles();
  const [sites, setsites] = useState(project ? project.sites : []);
  const [filter, setfilter] = useState('');
  const history = useHistory();


  const lowercasedFilter = filter.toLowerCase();

  const filteredData = (siteList) => {
    if (siteList && siteList.length > 0) {
      return siteList.filter((item) => {
        if (item.name.toLowerCase().includes(lowercasedFilter)) {
          return item;
        }
        return null;
      });
    }
    return null;
  };

  const updateFilter = (event) => {
    setfilter(event.target.value);
  };

  const onSelectHandler = (item) => {
    history.push(`${linkto}/${item.id}`);
  };
  useEffect(() => {
    console.log('setSites finished', sites);
    const getProjectSites = async (id) => {
      try {
        const res = await api.get(`/projects/${id}/sites`);
        setsites(() => res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (project && (!sites || sites.length < 1)) {
      getProjectSites(project.id);
    }
  }, [project, sites]);
  return (
    <Card className={classes.root}>
      <CardHeader title={<b>Sites List</b>} className={classes.title} />
      <CardContent className={classes.content}>
        {sites && (
          <>
            <List component="nav" aria-label="main search sites">
              <ListItem
                className="form-group has-search border-bottom-0"
              >
                <FormControl fullWidth>
                  <InputLabel htmlFor="search-site">{`Find a ${searchname}`}</InputLabel>
                  <Input
                    id="search-site"
                    fullWidth
                    type="text"
                    onChange={updateFilter}
                    endAdornment={<SearchIcon />}
                  />
                </FormControl>
              </ListItem>
              {sites && sites.length > 0 && filteredData(sites).slice(0, limit).map((item) => (
                <ListItem key={item.id} onClick={() => onSelectHandler(item)} button>
                  <Grid container>
                    <Grid item lg={2}>
                      <RoomIcon />
                    </Grid>
                    <Grid item lg={limit === 1 ? 4 : 10}>
                      {item.name}
                    </Grid>
                    {limit === 1 && (
                    <Grid item lg={6}>
                      <span> last value : </span>
                      {item.last_value ? moment(moment(item.last_value).format('MM/DD/YYYY')).fromNow() : 'No value'}
                    </Grid>
                    )}
                  </Grid>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
}

SearchList.propTypes = {
  project: PropTypes.objectOf(PropTypes.any),
  limit: PropTypes.number,
  linkto: PropTypes.string,
  searchname: PropTypes.string,
};
SearchList.defaultProps = {
  project: {
    id: 0,
    name: 'no project selected',
    sites: [{
      id: 0,
      last_value: 'N/D',
      name: 'N/D',
      previsional_end: 'N/D',
      start_date: 'N/D',
      type: 'N/D',
    }],
  },
  limit: 1,
  linkto: '/graphs',
  searchname: 'Site',
};


export default SearchList;

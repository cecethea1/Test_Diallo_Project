import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Alert, Autocomplete } from '@material-ui/lab';
import {
  makeStyles, TextField, Paper, FormGroup, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import api from '../../store/api';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
    marginLeft: '20px',
  },
  paper: {
    padding: '10px',
  },
}));

function MarkerForm({
  createMarker, setImageUrl, site, markers, newMarker, images, siteSelecter, sites, project,
}) {
  const [sensors, setSensors] = useState();
  const [selectedImage, setSelectedImage] = useState({ url: '/images/placeholder-600x400.png', id: 0, name: 'N/D' });
  const classes = useStyles();
  const handleInputChange = useCallback((selected) => {
    if (selected) createMarker(selected.id);
  }, [createMarker]);

  const selectImageHandler = (e) => {
    const { value } = e.target;
    setSelectedImage(value);
    setImageUrl(value);
  };

  useEffect(() => {
    let cancel = false;
    const fetchSensors = async () => {
      let res;
      if (site.id > 0) {
        res = await api.get(`sites/${site.id}/sensors`);
      } else {
        res = await api.get(`sensors/project/${project.id}`);
      }
      if (res.status === 200) {
        const markersIds = markers.map((m) => (m.sensor_id));
        const newSensors = markersIds.length > 0 ? res.data.filter((s) => markersIds.indexOf(s.id) === -1) : res.data;
        if (cancel) return;
        setSensors(newSensors);
      }
    };
    if (site && markers) {
      fetchSensors();
    }
    return () => { cancel = true; };
  }, [site, markers, sites]);

  return (
    <Paper className={classes.paper} elevation={3}>
      <FormGroup row>
        <FormControl className={classes.formControl}>
          <InputLabel id="site-select-label">
            Select Site
          </InputLabel>
          <Select
            labelId="site-select-label"
            id="site-select"
            value={site.name}
          >
            <MenuItem onClick={() => siteSelecter({ id: 0, name: 'all_sites' })} value="all_sites" key={0}>
              <span>All SITES</span>
            </MenuItem>
            {sites && sites.length > 0 && sites.map((s) => (
              <MenuItem onClick={() => siteSelecter(s)} value={s.name} key={s.id}>
                <span>{s.name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="image-url-select-label">
            Select Background Site
          </InputLabel>
          <Select
            labelId="image-url-select-label"
            id="image-url-select"
            value={selectedImage}
            onChange={selectImageHandler}
          >
            {images && images.length > 0 && images.map((img) => (
              <MenuItem value={img.url} key={img.url}>
                <span>{img.name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {newMarker && sensors && sensors.length > 0 && (
          <FormControl className={classes.formControl}>
            <Autocomplete
              id={`${site.id}`}
              options={sensors}
              onChange={(_e, selected) => {
                handleInputChange(selected);
              }}
              getOptionLabel={(option) => `${option.name} | ${option.type}`}
              renderInput={(params) => <TextField {...params} label="Sensors" placeholder="Select Sensor" />}
            />
          </FormControl>
        )}
      </FormGroup>

      {(!newMarker && sensors && sensors.length > 0) && (
        <Alert severity="success" color="info">
          Please click on image to pick new sensor
        </Alert>
      )}
      {(!sensors || sensors.length < 1) && (
        <Alert severity="warning" color="info">
          Double click on marker to remove picker
        </Alert>
      )}
    </Paper>
  );
}

MarkerForm.propTypes = {
  createMarker: PropTypes.func.isRequired,
  setImageUrl: PropTypes.func.isRequired,
  siteSelecter: PropTypes.func.isRequired,
  site: PropTypes.objectOf(PropTypes.any).isRequired,
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  markers: PropTypes.arrayOf(PropTypes.any).isRequired,
  images: PropTypes.arrayOf(PropTypes.any).isRequired,
  newMarker: PropTypes.objectOf(PropTypes.any),
  sites: PropTypes.arrayOf(PropTypes.any).isRequired,
};
MarkerForm.defaultProps = {
  newMarker: null,
};

export default MarkerForm;

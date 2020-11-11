import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemIcon, ListItemText, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import api from '../../store/api';

const sensorIcon = L.icon({
  iconUrl: '/images/icons/sensor.svg',
  iconSize: [30, 30],
  iconAnchor: [25, 20],
});

const useStyles = makeStyles(() => ({
  customTooltip: {
    fontSize: '0.5em',
  },
}));

function CustomMarker({
  marker, onDblClick, dragEndUpdateMarkers, editable, isLoaded, ratio,
}) {
  const [data, setData] = useState({ ...marker });
  const [dragged, setDragged] = useState(false);
  const classes = useStyles();
  const updatePositionHandler = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setData({ ...marker, x: lat, y: lng });
    setDragged((d) => !d);
    dragEndUpdateMarkers({ ...marker, x: lat, y: lng });
  };

  useEffect(() => {
    if (marker) {
      setData({ ...marker });
    }
  }, [marker]);

  const fetchSensorData = async () => {
    const res = await api.get(`/sensors/${marker.sensor_id}/last`);
    if (res.status === 200) {
      const {
        x, y, unit, metric, name,
      } = res.data;
      const dateAxis = x ? moment(new Date(x)).format('D/M/Y hh:mm:ss ') : null;
      setData({
        ...data, x_axis: dateAxis, y_axis: y, metric, unit, name,
      });
    }
  };

  useEffect(() => {
    let cancel = false;
    const fetchMarkerData = async () => {
      if (cancel) return;
      const res = await api.get(`/sensors/${marker.sensor_id}/last`);
      if (cancel) { return; }
      if (res.status === 200) {
        const {
          x, y, unit, metric, name,
        } = res.data;
        const dateAxis = x ? moment(new Date(x)).format('D/M/Y hh:mm:ss ') : null;
        setData({
          ...data, x_axis: dateAxis, y_axis: y, metric, unit, name,
        });
        if (isLoaded) isLoaded();
      }
    };
    if (marker && marker.sensor_id) {
      fetchMarkerData();
    }
    return () => { cancel = true; };
  }, [dragged, marker, ratio]);

  return (
    ratio && (
      <Marker
        ondblclick={editable ? onDblClick : fetchSensorData}
        position={[data.x, data.y]}
        customId={data.sensor_id}
        ondragend={updatePositionHandler}
        icon={sensorIcon}
        draggable={editable}
      >
        <Tooltip
          opacity={!data.sensor_id ? '60%' : '80%'}
          permanent
          direction="right"
          classes={{
            tooltip: classes.customTooltip,
            arrow: classes.customArrow,
          }}
        >
          <List>
            {data.sensor_id && (
              <>
                <ListItem>
                  <ListItemIcon>Name</ListItemIcon>
                  <ListItemText primary={<strong>{data.name}</strong>} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>Date</ListItemIcon>
                  <ListItemText primary={data.x_axis || 'No Data'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>Y</ListItemIcon>
                  <ListItemText primary={data.y_axis || 'No Data'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>Metric</ListItemIcon>
                  <ListItemText primary={data.metric || 'No Data'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>Unit</ListItemIcon>
                  <ListItemText primary={data.unit || 'No Data'} />
                </ListItem>
              </>
            )}
          </List>
        </Tooltip>
      </Marker>
    )
  );
}

CustomMarker.propTypes = {
  marker: PropTypes.objectOf(PropTypes.any).isRequired,
  onDblClick: PropTypes.func.isRequired,
  dragEndUpdateMarkers: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  isLoaded: PropTypes.func.isRequired,
  ratio: PropTypes.number,
};

CustomMarker.defaultProps = {
  editable: false,
  ratio: 1,
};

export default CustomMarker;

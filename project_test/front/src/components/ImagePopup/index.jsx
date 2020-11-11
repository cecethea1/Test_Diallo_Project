import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Fab, Paper } from '@material-ui/core';
import { Edit, Save } from '@material-ui/icons';
import {
  Map as MapLeaflet, ImageOverlay,
} from 'react-leaflet';
import L, { CRS } from 'leaflet';
import Control from 'react-leaflet-control';
import _ from 'underscore';
import MarkerForm from './MarkerForm';
import CustomMarker from './CustomMarker';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { createImagePopupsAsync, getImagePopupsDataAsync } from '../../store/project/reducer';
import api from '../../store/api';

const sensorIcon = L.icon({
  iconUrl: '/images/icons/sensor.svg',
  iconSize: [30, 30],
  iconAnchor: [25, 20],
});

const ImagePopup = ({ project, editMode, size }) => {
  const {
    imagePopupsData, currentSite,
  } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState(project.sites);
  const [selectedSite, setSelectedSite] = useState(currentSite);
  const [image, setImage] = useState();
  const [markers, setMarkers] = useState();
  const [editable, setEditable] = useState(false);
  const [mapDim, setMapDim] = useState([400, 600]);
  const [ratio, setRatio] = useState(null);
  const [newMarker, setNewMarker] = useState();
  const mapRef = useRef();


  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;
      map.doubleClickZoom.disable();
      const onMapClick = (e) => {
        const marker = L.marker(e.latlng, { draggable: 'true', icon: sensorIcon });
        const position = marker.getLatLng();
        setNewMarker({ ...newMarker, x: position.lat, y: position.lng });
      };
      map.on('click', onMapClick);
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (selectedSite) {
      dispatch(getImagePopupsDataAsync(selectedSite.id, project.id));
    }
  }, [selectedSite, dispatch, editable, project]);

  useEffect(() => {
    if (currentSite) {
      setSelectedSite(currentSite);
    }
  }, [currentSite]);

  useEffect(() => {
    if (imagePopupsData) {
      setImage(imagePopupsData.image_url);
    }
  }, [imagePopupsData, editable, selectedSite]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;
      if (map) {
        map.invalidateSize();
      }
      if (image) {
        const img = new Image();
        img.src = image;
        img.addEventListener('load', (e) => {
          if (mapRef.current && mapRef.current.container && imagePopupsData.coords) {
            const { naturalHeight, naturalWidth } = e.path ? e.path[0] : e.originalTarget;
            const { container } = mapRef.current;
            const { clientHeight, clientWidth } = container;
            const r = Math.min(clientHeight / naturalHeight, clientWidth / naturalWidth);
            setRatio(() => r);
            setMapDim([naturalHeight * r, naturalWidth * r]);
            const coords = imagePopupsData.coords.map((m) => ({
              ...m,
              x: m.x * ratio,
              y: m.y * ratio,
            }));
            setMarkers(coords);
          }
        });
        img.removeEventListener('load', console.log('load image listner removed'));
      }
    }
  }, [image, size]);

  useEffect(() => {
    if (currentSite) {
      setSelectedSite(currentSite);
    }
  }, [currentSite]);

  useEffect(() => {
    if (imagePopupsData) {
      setImage(imagePopupsData.image_url);
    }
  }, [imagePopupsData, editable, currentSite]);

  useEffect(() => {
    if (image && ratio && imagePopupsData && imagePopupsData.coords) {
      const coords = imagePopupsData.coords.map((m) => ({
        ...m,
        x: m.x * ratio,
        y: m.y * ratio,
      }));
      setMarkers(coords);
    }
  }, [ratio, imagePopupsData]);

  useEffect(() => {
    const fetchSites = async () => {
      const res = await api.get(`/projects/${project.id}/sites`);
      setSites(res.data);
    };
    if (project && editMode) {
      fetchSites();
    }
  }, [project, editMode]);

  useEffect(() => {
    if (newMarker && newMarker.sensor_id) {
      const list = [...markers, { ...newMarker }];
      const uniqueMarkers = _.chain(list).indexBy('sensor_id').values().value();
      setMarkers([...uniqueMarkers]);
      setNewMarker(null);
    }
  }, [newMarker]);

  function markerDoubleClickHandler(e) {
    const map = mapRef.current.leafletElement;
    const marker = e.target;
    map.removeLayer(marker);
    setMarkers((prevMarkers) => (prevMarkers.filter((m) => m.sensor_id !== marker.options.customId)));
  }

  const createMarkerHandler = (id) => {
    setNewMarker({ ...newMarker, sensor_id: id });
  };

  const saveMarkersHandler = () => {
    if (ratio && selectedSite) {
      const payload = {
        ...imagePopupsData, coords: markers, image_url: image, site_id: selectedSite.id,
      };
      dispatch(createImagePopupsAsync(payload, ratio, project.id));
      dispatch(getImagePopupsDataAsync(selectedSite.id, project.id));
      setEditable(false);
      setNewMarker(null);
    }
  };

  const dragEndUpdateMarkersHandler = (d) => {
    const { x, y, sensor_id: sernsorId } = d;
    setMarkers((mrs) => mrs.map((m) => (m.sensor_id === sernsorId ? { x, y, sensor_id: sernsorId } : m)));
  };

  const isLoadedHandler = () => setLoading(false);

  return (
    <Paper>
      <LoadingSpinner show={loading && !editable} />
      {editable && (
        <MarkerForm
          newMarker={newMarker}
          site={selectedSite}
          siteSelecter={setSelectedSite}
          markers={markers}
          sites={sites}
          createMarker={createMarkerHandler}
          images={project.photos}
          project={project}
          setImageUrl={setImage}
        />
      )}
      {image && (
        <MapLeaflet
          ref={mapRef}
          key={!selectedSite ? 'edit_mode' : `sensor_${selectedSite.id}`}
          crs={CRS.Simple}
          dragging={(editable && editMode) || !editMode}
          zoomControl
          scrollWheelZoom={false}
          zoomSnap={(editable && editMode) || !editMode}
          zoomDelta
          minZoom="-2"
          maxZoom="3"
          style={{ height: '70vh' }}
          bounds={[[0, 0], mapDim]}
        >
          { mapRef.current && (
            <ImageOverlay
              url={image}
              bounds={[[0, 0], mapDim]}
              className="ovelay-image"
            >
              {editMode && !editable && (
                <Control position="topleft">
                  <Fab
                    aria-label="Update"
                    color="primary"
                    onClick={() => setEditable(true)}
                  >
                    <Edit />
                  </Fab>
                </Control>
              )}
              {editMode && editable && (
                <Control position="topleft">
                  <Fab
                    aria-label="Update"
                    color="primary"
                    onClick={saveMarkersHandler}
                  >
                    <Save />
                  </Fab>
                </Control>
              )}
              <div>
                {
                markers && markers.length > 0 && markers
                  .map((m) => (
                    <CustomMarker
                      key={m.sensor_id}
                      ratio={ratio}
                      onDblClick={markerDoubleClickHandler}
                      marker={m}
                      dragEndUpdateMarkers={dragEndUpdateMarkersHandler}
                      isLoaded={isLoadedHandler}
                      editable={editable}
                    />
                  ))
              }
              </div>
            </ImageOverlay>
          )}
        </MapLeaflet>
      )}
    </Paper>
  );
};

ImagePopup.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  size: PropTypes.arrayOf(PropTypes.any),
  editMode: PropTypes.bool,
};

ImagePopup.defaultProps = {
  editMode: false,
  size: [],
};

export default ImagePopup;

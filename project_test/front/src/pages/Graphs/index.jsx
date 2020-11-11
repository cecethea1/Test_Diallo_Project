import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Timeseries from '../../components/Graphe/Timeseries';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import PageContainer from '../../components/Shared/PageContainer';
import { SELECT_SITE } from '../../store/project/actions';
import { fetchConfigsAsync } from '../../store/graph/reducer';
import SideBar from '../../components/Graphe/SideBar';
import './style.scss';

export default function Sensor() {
  const { id: confId } = useParams();
  const { currentSite, currentProject } = useSelector((state) => state.project);
  const { currentConfig, configs } = useSelector((state) => state.graph);
  const dispatch = useDispatch();
  const sites = currentProject && currentProject.sites ? currentProject.sites : [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (confId && sites) {
      const selected = sites.find((s) => s.id.toString() === confId);
      dispatch({ type: SELECT_SITE, payload: selected });
    }
  }, [confId, sites, dispatch]);

  useEffect(() => {
    if (!configs) {
      setTimeout(() => setLoading(true));
    }
    if (configs) {
      setTimeout(() => setLoading(false));
    }
  }, [configs]);

  useEffect(() => {
    if (currentSite) {
      dispatch(fetchConfigsAsync(currentSite.id,currentProject.sites));
    }
  }, [currentSite]);

  const displayGraph = () => {
    let selectedGraphs = [];
    if (currentConfig) {
      selectedGraphs = configs.filter((e) => e.id === currentConfig);
    } else {
      selectedGraphs = configs;
    }
    const graphs = selectedGraphs.map((conf) => {
      switch (conf.type) {
        case 'timeseries':
          return (
            <Timeseries
              key={conf.id}
              title={conf.name}
              sensors={conf.sensors_id}
              metric={conf.metric}
              limX={[conf.min_x, conf.max_x]}
              limY={[conf.min_y, conf.max_y]}
              downsampling={200}
            />
          );
        default:
          return null;
      }
    });
    return graphs;
  };

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item lg={2} xs={12}>
          <SideBar config={currentConfig} configs={configs} />
        </Grid>
        {currentSite && configs && !loading
          && (
            <Grid item lg={10} xs={12}>
              <h4>{currentSite.name}</h4>
              {displayGraph()}
            </Grid>
          )}
      </Grid>
      <LoadingSpinner show={loading} />
    </PageContainer>
  );
}

Sensor.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
